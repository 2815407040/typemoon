<template>
  <div class="show-container">
    <!-- 移除页面顶部直接显示的currentTitle -->
    <div class="content">
      <div
          v-for="(line, index) in displayContent"
          :key="index"
          :class="{ 'highlight': index === highlightLineIndex }"
          v-html="formatLine(line)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUpdated } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentTitle = ref('')
const displayContent = ref<string[]>([])
const highlightLineIndex = ref(-1)
const mdLines = ref<string[]>([])
const targetLineNumber = ref(0)

// 格式化行内容（处理Markdown格式）
const formatLine = (line: string) => {
  if (line.startsWith('#')) {
    const level = line.match(/#+/g)?.[0].length || 1
    const text = line.replace(/#+\s?/, '').replace(/\*\*/g, '')
    return `<h${level}>${text}</h${level}>`
  }
  if (line.includes('**')) {
    return line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  }
  return line.trim() ? `<p>${line}</p>` : ''
}

// 查找下一个一级标题的位置
const findNextLevel1Title = (startIndex: number) => {
  for (let i = startIndex; i < mdLines.value.length; i++) {
    const trimmedLine = mdLines.value[i].trim()
    if (trimmedLine.startsWith('# ') && !trimmedLine.startsWith('##')) {
      return i
    }
  }
  return mdLines.value.length  // 无下一个标题时返回文档长度
}

// 清理标题内容（移除标记）
const cleanTitleContent = (content: string) => {
  return content.replace(/#+\s?/g, '').replace(/\*\*/g, '').trim()
}

onMounted(async () => {
  try {
    currentTitle.value = route.params.title as string
    targetLineNumber.value = route.params.lineNumber
        ? parseInt(route.params.lineNumber as string)
        : 0

    if (isNaN(targetLineNumber.value) || targetLineNumber.value <= 0) {
      throw new Error('无效的行号参数')
    }

    const response = await fetch('/Fate.md')
    if (!response.ok) {
      throw new Error(`请求失败: ${response.status}`)
    }

    const content = await response.text()
    mdLines.value = content.split(/\r?\n/)

    // 查找目标行所在的一级标题
    let level1Start = targetLineNumber.value - 1 // 转换为数组索引
    while (level1Start >= 0) {
      const trimmedLine = mdLines.value[level1Start].trim()
      if (trimmedLine.startsWith('# ') && !trimmedLine.startsWith('##')) {
        break
      }
      level1Start--
    }
    if (level1Start < 0) level1Start = 0

    // 提取当前标题下的完整内容（包含所有子标题和文本）
    const nextLevel1 = findNextLevel1Title(level1Start + 1)
    const allContent = mdLines.value.slice(level1Start, nextLevel1)

    // 过滤掉开头与搜索标题完全匹配的行（只删开头的一个）
    const cleanedContent = [...allContent]
    const firstMatchIndex = cleanedContent.findIndex(line =>
        cleanTitleContent(line) === currentTitle.value
    )
    if (firstMatchIndex === 0) {
      cleanedContent.shift() // 只删除开头第一个匹配的标题
    }

    displayContent.value = cleanedContent

    // 计算高亮行索引（处理开头被删除的情况）
    const originalIndex = (targetLineNumber.value - 1) - level1Start
    highlightLineIndex.value = firstMatchIndex === 0 && originalIndex > 0
        ? originalIndex - 1  // 如果开头的标题被删除，索引减1
        : originalIndex
  } catch (error) {
    console.error('加载内容失败:', error)
  }
})

onUpdated(() => {
  if (highlightLineIndex.value >= 0) {
    const elements = document.querySelectorAll('.content > div')
    const targetElement = elements[highlightLineIndex.value]
    targetElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
})
</script>

<style scoped>
/* 样式保持不变 */
.show-container {
  padding: 20px;
}

.content {
  margin-top: 20px;
  line-height: 1.8;
}

.content h1 {
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
  margin: 20px 0;
}

.content h2, .content h3 {
  color: #34495e;
  margin: 15px 0;
}

.content p {
  margin: 10px 0;
}

.content .highlight {
  background-color: rgba(255, 255, 0, 0.3);
  padding: 5px;
  border-radius: 3px;
}

strong {
  font-weight: bold;
  color: #e74c3c;
}
</style>