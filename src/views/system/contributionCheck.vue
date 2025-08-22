<template>
  <div class="contribution-container">
    <el-card>
      <div slot="header" class="card-header">
        <span>贡献内容审核</span>
      </div>

      <!-- 内容展示区域 -->
      <div v-if="currentContribution" class="contribution-content">
        <el-descriptions column="1" border>
          <el-descriptions-item label="提交用户">{{ currentContribution.userId }}</el-descriptions-item>
          <el-descriptions-item label="标题">{{ currentContribution.name }}</el-descriptions-item>
          <el-descriptions-item label="索引位置">{{ currentContribution.indexTitle}}</el-descriptions-item>
          <el-descriptions-item label="内容">
            <div class="contribution-body">{{currentContribution.body}}</div>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 空状态 -->
      <el-empty v-else class="empty-state" description="暂无待审核内容"></el-empty>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button type="success" @click="handleAction('pass')">通过</el-button>
        <el-button type="warning" @click="handleAction('pending')">待定</el-button>
        <el-button type="danger" @click="handleAction('reject')">驳回</el-button>
      </div>

      <!-- 分页控件 -->
      <div class="pagination" v-if="total > 0">
        <el-pagination
            layout="prev, pager, next"
            :total="total"
            :page-size="1"
            :current-page="currentPage"
            @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

interface Contribution {
  id: number
  userId: number
  userName: string
  name: string
  indexTitle: string
  body: string
  is_check: number
}

const contributions = ref<Contribution[]>([])
const currentContribution = ref<Contribution | null>(null)
const total = ref(0)
const currentPage = ref(1) // 当前页码


// 加载贡献数据
const loadContributionData = async () => {

  try {

    const response = await axios.get('http://localhost:3000/api/contributions', {
      params: {
        isCheck: 0
      }
    })

    contributions.value = response.data.list
    total.value = response.data.total
    // 加载完成后显示当前页数据
    updateCurrentContribution()
  } catch (error) {
    console.error('加载贡献数据失败:', error)
    ElMessage.error('加载数据失败，请稍后重试')
  }
}

// 更新当前显示的贡献内容
const updateCurrentContribution = () => {
  // 分页逻辑：当前页索引 = 当前页码 - 1
  currentContribution.value = contributions.value[currentPage.value - 1] || null
}

// 处理分页切换
const handlePageChange = (page: number) => {
  currentPage.value = page
  updateCurrentContribution()
}

// 处理审核操作
const handleAction = async (action: string) => {
  if (!currentContribution.value) return
  const statusMap = {
    pass: 1,
    pending: 2,
    reject: 3
  }
  const isCheck = statusMap[action]

  try {
    // 调用API更新状态
    await axios.patch(`http://localhost:3000/api/contributions/${currentContribution.value.id}`, {
      isCheck
    })

    const currentIndex = contributions.value.findIndex(item => item.id === currentContribution.value!.id)
    if (currentIndex > -1) {
      contributions.value.splice(currentIndex, 1)
      total.value--
    }

    if (currentPage.value > 1 && currentPage.value > contributions.value.length) {
      currentPage.value--
    }

    // 更新当前显示内容
    updateCurrentContribution()

    ElMessage.success('操作成功')
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败，请稍后重试')
  }
}

onMounted(() => {
  loadContributionData()
})
</script>

<style scoped>
.contribution-container {
  padding: 20px;
}

.card-header {
  font-size: 16px;
  font-weight: bold;
}

.contribution-content {
  margin: 20px 0;
}

.contribution-body {
  white-space: pre-wrap;
  line-height: 1.8;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

.empty-state {
  padding: 50px 0;
  text-align: center;
}

/* 分页样式 */
.pagination {
  margin-top: 20px;
  text-align: center;
}
</style>