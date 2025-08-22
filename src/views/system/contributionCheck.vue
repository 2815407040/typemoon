<template>
  <div class="contribution-container">
    <el-card>
      <div slot="header" class="card-header">
        <span>贡献内容审核</span>
      </div>

      <!-- 内容展示区域 -->
      <div v-if="currentContribution" class="contribution-content">
        <el-descriptions column="1" border>
          <el-descriptions-item label="提交用户">{{ currentContribution.userName }}</el-descriptions-item>
          <el-descriptions-item label="标题">{{ currentContribution.name }}</el-descriptions-item>
          <el-descriptions-item label="索引位置">{{ currentContribution.indexTitle}}</el-descriptions-item>
          <el-descriptions-item label="内容">
            <div class="contribution-body">{{currentContribution.body}}</div>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons" >
        <el-button type="success" @click="(1)">通过</el-button>
        <el-button type="warning" @click="(2)">待定</el-button>
        <el-button type="danger" @click="(3)">驳回</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage, ElEmpty, ElLoading } from 'element-plus'

interface Contribution {
  id: number
  userId: number
  userName: string  // 新增：显示提交用户的用户名
  name: string
  indexTitle: string
  body: Text
  is_check: number
}

const contributions = ref<Contribution[]>([])
const currentContribution = ref<Contribution | null>(null)
const total = ref(0)
const currentPage = ref(1)

const loadContributionData = async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/contributions')
    contributions.value = response.data
    total.value = contributions.value.length     //总条数
    currentContribution.value = contributions.value[currentPage.value - 1] || null
  } catch (error) {
    console.error('加载贡献数据失败:', error)
    ElMessage.error('加载数据失败，请稍后重试')
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