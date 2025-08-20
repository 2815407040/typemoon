<template>
  <div class="home-container">
    <div class="nav">
      <!-- 导航栏内容 -->
    </div>
    <div class="main-body">
      <div class="left-panel"></div>
      <div class="right-panel">
        <div class="header">
          <div class="contribution-link">
            <span @click="goToContribution">我要贡献词条</span>
          </div>
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

// 新增：跳转到贡献页面
const goToContribution = () => {
  router.push({
    path: '/HomeView/contribution'
  })
}

// 搜索相关代码（保持不变）
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
/* 关键修改：确保根容器占满屏幕高度 */
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}

.home-container {
  min-height: 100vh; /* 最小高度为视口高度 */
  display: flex;
  flex-direction: column; /* 垂直布局 */
}

.header{
  background-image: url('../../public/images/header.jpg');
  height: 230px;
  width: 100%;
  position: relative;
}

/* 新增：贡献词条链接样式 */
.contribution-link {
  position: absolute;
  left: 20px;
  bottom: 20px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
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

/* 主内容区域样式 */
.main-body{
  flex: 1; /* 占据剩余所有空间 */
  width: 100%;
  background-color: #aabcbf;
  display: flex;
  min-height: 0; /* 解决flex子元素高度计算问题 */
}

.left-panel{
  width: 10%;
  background-color: #c7e4ed;
  min-height: 100%; /* 与父容器高度保持一致 */
}

.right-panel{
  width: 90%;
  background-color: #d9edf3;
  display: flex;
  flex-direction: column; /* 垂直布局 */
  min-height: 100%; /* 确保与左侧高度一致 */
}

.main-content{
  flex: 1; /* 占据右侧面板剩余空间 */
  background-color: #93ccdd;
  width: 100%;
}

.nav{
  height: 30px;
  width: 100%;
  background-image: url('../../public/images/nav.png');
  background-repeat: no-repeat;
  background-size: cover;
}
</style>