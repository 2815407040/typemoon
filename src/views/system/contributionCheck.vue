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
      <!-- 修改操作按钮，添加点击事件 -->
      <div class="action-buttons" v-if="currentContribution && !loading">
        <el-button type="success" @click="handleApprove">通过</el-button>
        <el-button type="warning" @click="handleCheck(2)">待定</el-button>
        <el-button type="danger" @click="handleCheck(3)">驳回</el-button>
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
const API_BASE_URL = 'http://localhost:3001/api/contributions';

const handleCheck = async (status: number) => {
  if (!currentContribution.value) return;

  try {
    loading.value = true;
    // 发送更新状态请求
    await axios.patch(`${API_BASE_URL}/${currentContribution.value.id}/status`, {
      check: status
    });

    ElMessage.success(status === 1 ? '审核通过' : status === 2 ? '设为待定' : '已驳回');

    // 重新加载数据
    await loadContributionData();

    // 如果还有数据，显示下一条
    if (contributions.value.length > 0) {
      currentPage.value = 1;
      currentContribution.value = contributions.value[0];
    }
  } catch (error) {
    console.error('更新审核状态失败:', error);
    ElMessage.error('操作失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};
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
  currentPage.value = page;
  currentContribution.value = contributions.value[page - 1] || null;
};

// 处理通过审核的逻辑
const handleApprove = async () => {
  if (!currentContribution.value) return

  try {
    // 1. 获取Fate.md内容
    const mdResponse = await fetch('/Fate.md')
    if (!mdResponse.ok) {
      throw new Error(`获取Fate.md失败: ${mdResponse.status}`)
    }
    const mdContent = await mdResponse.text()
    const mdLines = mdContent.split(/\r?\n/)

    // 2. 查找indexTitle在Fate.md中的位置和级别
    const { index: targetIndex, level: check1Level } = findTitleInMd(mdLines, currentContribution.value.indexTitle)
    if (targetIndex === -1) {
      ElMessage.error('未找到对应的索引标题')
      return
    }

    // 3. 查找插入位置（check2）
    const insertIndex = findInsertPosition(mdLines, targetIndex, check1Level)

    // 4. 准备要插入的内容
    const titleToInsert = `${'#'.repeat(check1Level)} ${currentContribution.value.name}`
    const contentToInsert = currentContribution.value.body.split('\n')

    // 5. 插入内容到正确位置
    const newMdLines = [
      ...mdLines.slice(0, insertIndex),
      titleToInsert,
      ...contentToInsert,
      ...mdLines.slice(insertIndex)
    ]
    const newMdContent = newMdLines.join('\n')

    // 6. 保存更新后的Fate.md（这里需要后端接口支持）
    await axios.post('http://localhost:3001/api/update-fate-md', {
      content: newMdContent
    })

    // 7. 更新贡献状态为已通过（需要后端接口支持）
    await axios.patch(`http://localhost:3001/api/contributions/${currentContribution.value.id}`, {
      check: 1 // 1表示通过
    })

    ElMessage.success('贡献已通过并已添加到Fate.md')

    // 8. 重新加载贡献列表
    loadContributionData()
  } catch (error) {
    console.error('处理贡献失败:', error)
    ElMessage.error('处理贡献失败，请稍后重试')
  }
}

// 在Markdown中查找标题并返回其位置和级别
const findTitleInMd = (lines: string[], title: string) => {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.startsWith('#')) {
      // 提取标题级别
      const levelMatch = line.match(/^#{1,6}/)
      if (levelMatch) {
        const level = levelMatch[0].length
        // 清理标题内容并比较
        const cleanLine = line.replace(/^#{1,6}\s?/, '').replace(/\*\*/g, '').trim()
        if (cleanLine === title) {
          return { index: i, level }
        }
      }
    }
  }
  return { index: -1, level: 0 }
}

// 查找插入位置（check2）
const findInsertPosition = (lines: string[], startIndex: number, check1Level: number) => {
  // 从目标标题的下一行开始查找
  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.startsWith('#')) {
      // 提取标题级别
      const levelMatch = line.match(/^#{1,6}/)
      if (levelMatch) {
        const level = levelMatch[0].length
        // 找到同级标题或高一级标题
        if (level === check1Level || level === check1Level - 1) {
          return i
        }
      }
    }
  }
  // 如果没有找到，就插入到文件末尾
  return lines.length
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