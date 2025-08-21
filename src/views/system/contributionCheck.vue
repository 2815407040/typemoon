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
        <el-button type="success" @click="handleCheck" >通过</el-button>
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
    // 更新审核状态
    await axios.patch(`http://localhost:3001/api/contributions/${currentContribution.value.id}`, {
      check: status // 确保参数名与后端预期一致
    });

    // 如果是通过状态，执行插入操作
    if (status === 1) {
      await handleApprove();
    }

    ElMessage.success(status === 1 ? '审核通过并已插入文档' :
        status === 2 ? '已设为待定' : '已驳回');

    // 重新加载数据
    await loadContributionData();
  } catch (error) {
    console.error('审核操作失败:', error);
    ElMessage.error('操作失败，请稍后重试');
  }
};

// 处理通过并插入文档
const handleApprove = async () => {
  if (!currentContribution.value) return;

  try {
    // 1. 获取当前Fate.md内容
    const response = await fetch('/Fate.md');
    if (!response.ok) {
      throw new Error(`获取文档失败: ${response.status}`);
    }
    let content = await response.text();

    // 2. 找到索引位置并插入内容
    const lines = content.split(/\r?\n/);
    const indexTitle = currentContribution.value.indexTitle;
    let insertPosition = -1;

    // 查找目标索引位置
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(indexTitle)) {
        insertPosition = i + 1; // 插入到目标行的下一行
        break;
      }
    }

    // 如果未找到索引位置，默认插入到文档末尾
    if (insertPosition === -1) {
      insertPosition = lines.length;
    }

    // 3. 构造要插入的内容
    const contributionContent = `\n## ${currentContribution.value.name}\n${currentContribution.value.body}\n`;

    // 4. 插入内容
    lines.splice(insertPosition, 0, contributionContent);
    const newContent = lines.join('\n');

    // 5. 保存更新后的文档（这里假设后端有更新文档的接口）
    await axios.post('http://localhost:3001/api/update-fate-md', {
      content: newContent
    });

  } catch (error) {
    console.error('插入文档失败:', error);
    throw error; // 抛出错误让上层处理
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