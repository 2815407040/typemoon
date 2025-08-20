<template>
  <div class="home-container">
    <div class="nav">
      <!-- 移除登录注册按钮区域 -->
    </div>
    <div class="main-body">
      <div class="left-panel"></div>
      <div class="right-panel">
        <div class="header">
          <div class="search-container">
            <input
                type="text"
                placeholder="请输入搜索内容"
                class="search-input"
                v-model="searchText"
                @input="handleSearch"
            >
            <div v-if="showResults" class="search-results">
              <div
                  v-for="item in matchedResults"
                  :key="item.lineNumber"
                  class="result-item"
                  @click="selectResult(item)"
              >
                {{ item.cleanContent }}
              </div>
            </div>
          </div>
        </div>
        <div class="main-content">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 搜索相关代码
const mdLines = ref<string[]>([]);
const mdTitleLines = ref<Array<{ lineNumber: number; content: string; cleanContent: string }>>([]);
const searchText = ref('');
const matchedResults = ref<Array<{ lineNumber: number; content: string; cleanContent: string }>>([]);

const showResults = computed(() => {
  return searchText.value.trim() !== '' && matchedResults.value.length > 0;
});

const cleanTitleContent = (content: string) => {
  return content
      .replace(/#+\s?/g, '')
      .replace(/\*\*/g, '')
      .trim();
};

onMounted(async () => {
  // 加载md文件
  try {
    const response = await fetch('/Fate.md');
    if (!response.ok) {
      throw new Error(`请求失败: ${response.status}`);
    }
    const content = await response.text();
    mdLines.value = content.split(/\r?\n/);
    mdTitleLines.value = mdLines.value
        .map((line, index) => ({
          lineNumber: index + 1,
          content: line,
          cleanContent: cleanTitleContent(line)
        }))
        .filter(item => /^#+\s?/.test(item.content.trim()));
  } catch (error) {
    console.error('获取Fate.md失败:', error);
  }
});

// 搜索处理
const handleSearch = () => {
  const query = searchText.value.trim().toLowerCase();
  if (!query) {
    matchedResults.value = [];
    return;
  }
  matchedResults.value = mdTitleLines.value.filter(item => {
    return item.cleanContent.toLowerCase().includes(query);
  });
};

const selectResult = (item: { lineNumber: number; content: string; cleanContent: string }) => {
  searchText.value = item.cleanContent;
  matchedResults.value = [];
  router.push({
    name: 'show',
    params: {
      title: item.cleanContent,
      lineNumber: item.lineNumber.toString()
    }
  });
};
</script>

<style scoped>
.header{
  background-image: url('../../public/images/header.jpg');
  height: 230px;
  width: 100%;
  position: relative;
}

.search-container {
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 300px;
}

.search-input{
  height: 30px;
  width: 100%;
  border-radius: 3px;
  box-sizing: border-box;
}

.search-results {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  transform: translateY(-100%);
  background-color: white;
  border-radius: 3px 3px 0 0;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.15);
  max-height: 200px;
  overflow-y: auto;
  z-index: 100;
}

.result-item {
  padding: 8px 12px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.2s;
}

.result-item:hover {
  background-color: #f0f0f0;
}

.main-content{
  width: 100%;
  height: 100%;
  background-color: #93ccdd;
}

/* 导航栏样式简化 */
.nav{
  height: 30px;
  width: 100%;
  background-image: url('../../public/images/nav.png');
  background-repeat: no-repeat;
  background-size: cover;
}

.main-body{
  height: 900px;
  width: 100%;
  background-color: #aabcbf;
  display: flex
}

.left-panel{
  height: 1130px;
  width: 10%;
  background-color: #c7e4ed;
}

.right-panel{
  height: 100%;
  width: 90%;
  background-color: #d9edf3;
}
</style>