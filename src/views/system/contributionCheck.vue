<template>
  <div class="contribution-container">
    <el-card>
      <div slot="header" class="card-header">
        <span>贡献内容审核</span>
      </div>

      <!-- 内容展示区域 -->
      <div v-if="currentContribution" class="contribution-content">
        <el-descriptions column="1" border>
          <el-descriptions-item label="标题">{{ currentContribution.name }}</el-descriptions-item>
          <el-descriptions-item label="索引位置">{{ currentContribution.indexTitle }}</el-descriptions-item>
          <el-descriptions-item label="内容">
            <div class="contribution-body">{{ currentContribution.body }}</div>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 无数据状态 -->
      <div v-else class="empty-state" v-if="!loading">
        <el-empty description="暂无贡献内容"></el-empty>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <el-loading-spinner></el-loading-spinner>
        <p>加载中...</p>
      </div>

      <!-- 分页控制 -->
      <div class="pagination-container" v-if="total > 0 && !loading">
        <el-pagination
            v-model:current-page="currentPage"
            :page-size="1"
            :total="total"
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
        />
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons" v-if="currentContribution && !loading">
        <el-button type="success" >通过</el-button>
        <el-button type="success" >待定</el-button>
        <el-button type="danger" >驳回</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage, ElEmpty, ElLoading } from 'element-plus'

// 定义贡献内容类型
interface Contribution {
  id: number
  userId: number
  name: string
  indexTitle: string
  body: string
  check:number
}

// 状态变量
const contributions = ref<Contribution[]>([])
const currentContribution = ref<Contribution | null>(null)
const currentPage = ref(1)
const total = ref(0)
const loading = ref(true)

// 加载贡献数据
const loadContributionData = async () => {
  try {
    loading.value = true
    const response = await axios.get('http://localhost:3001/api/contributions')
    contributions.value = response.data
    total.value = contributions.value.length
    // 显示当前页数据（一页一条）
    currentContribution.value = contributions.value[currentPage.value - 1] || null
  } catch (error) {
    console.error('加载贡献数据失败:', error)
    ElMessage.error('加载数据失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 分页切换
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  currentContribution.value = contributions.value[page - 1] || null
}



// 页面挂载时加载数据
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

.pagination-container {
  margin: 20px 0;
  text-align: center;
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

.loading-state {
  padding: 50px 0;
  text-align: center;
  color: #666;
}
</style>