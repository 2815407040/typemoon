<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <el-col :span="24">
          <h5 class="mb-2" style="text-align: center;color:#ffffff">后台管理系统</h5>
          <el-menu
              active-text-color="#ffd04b"
              background-color="#545c64"
              class="el-menu-vertical-demo"
              text-color="#fff"
              @open="handleOpen"
              @close="handleClose"
              :router="true"
              @select="handleSelect"
          >
            <el-sub-menu index="1">
              <template #title>
                <span>系统管理</span>
              </template>
              <el-menu-item index="/index/system/user">用户管理</el-menu-item>
              <el-menu-item index="/index/system/role">角色管理</el-menu-item>
              <el-menu-item index="/index/system/menu">菜单管理</el-menu-item>
            </el-sub-menu>
            <el-menu-item index="2">
              <span>用户设置</span>
            </el-menu-item>
            <el-menu-item index="3">
              <span>客户管理</span>
            </el-menu-item>
            <el-menu-item index="4">
              <span>系统管理</span>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-aside>
      <el-container>
        <el-header>
          <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentPath.includes('system')">系统管理</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentPath.includes('user')">用户管理</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentPath.includes('role')">角色管理</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentPath.includes('menu')">菜单管理</el-breadcrumb-item>
          </el-breadcrumb>

          <div class="user-info">
            <span class="username">{{ currentUser?.userName || '未登录' }}</span>
            <el-button
                type="text"
                class="logout-btn"
                @click="handleLogout"
            >
              退出登录
            </el-button>
          </div>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>

import Cookies from 'js-cookie'  // 引入Cookie工具
import {ref, onMounted, watch} from 'vue'
import { useRouter ,useRoute} from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const currentPath = ref(route.path)
const activeIndex = ref('1')

// 定义用户信息类型
interface UserInfo {
  id: number
  userName: string
  role: string
  email?: string
}

// 存储当前用户信息
const currentUser = ref<UserInfo | null>(null)
const router = useRouter()

// 页面挂载时读取Cookie中的用户信息
onMounted(() => {
  const userCookie = Cookies.get('currentUser')
  if (userCookie) {
    currentUser.value = JSON.parse(userCookie)
  } else {
    // 如果没有用户信息，跳转到登录页
    router.push('/login')
  }
})

// 退出登录处理
const handleLogout = () => {
  // 清除Cookie中的用户信息
  Cookies.remove('currentUser', { path: '/' })
  // 重置当前用户状态
  currentUser.value = null
  // 跳转到登录页
  router.push('/login')
  // 显示退出成功提示
  ElMessage.success('退出登录成功')
}

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

watch(
    () => route.path,
    (newPath) => {
      currentPath.value = newPath
      // 根据路径设置默认选中的菜单
      if (newPath.includes('user')) {
        activeIndex.value = '1'
      } else if (newPath.includes('role')) {
        activeIndex.value = '2'
      } else if (newPath.includes('menu')) {
        activeIndex.value = '3'
      }
    }
)

// 处理菜单点击
const handleSelect = (key: string, keyPath: string[]) => {
  switch(key) {
    case '1':
      router.push('/index/system/user')
      break
    case '2':
      router.push('/index/system/role')
      break
    case '3':
      router.push('/index/system/menu')
      break
  }
}
</script>

<style>
html, body, #app, .common-layout {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}

.el-container{
  height: 100%;
}

.el-header{
  background-color: #545c64;
  display: flex;
  align-items: center;
  color: white;
  padding-left: 20px;
  justify-content: space-between;  /* 新增：让面包屑和用户信息左右分布 */
}

/* 新增：用户信息样式 */
.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
  padding-right: 30px;
}

.username {
  color: white;
  font-size: 14px;
}

.logout-btn {
  color: white !important;
  font-size: 14px;
}

.breadcrumb-text.el-breadcrumb__inner,
.breadcrumb-text.el-breadcrumb__inner a {
  color: white !important;
}

.el-header .el-breadcrumb {
  --el-breadcrumb-text-color: white;
}

.el-header .el-breadcrumb .el-breadcrumb__inner,
.el-header .el-breadcrumb .el-breadcrumb__inner a,
.el-header .el-breadcrumb .el-breadcrumb__separator {
  color: white !important;
}

.el-aside{
  background-color: #545c64;
  height: 100%;
}

.el-main{
  height: 100%;
  background-color: #e2e5e8;
  padding: 10px;
}
</style>