<template>
  <div class="login-container">
    <el-card style="min-width: 480px; text-align: center; margin: 0 auto;">
      <template #header>
        <div class="card-header">
          <h2>登录</h2>
        </div>
      </template>
      <el-form class="login-form" label-position="left" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="user.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="user.password" placeholder="请输入密码" @keyup.enter="handleLogin"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleLogin">登录</el-button>
        <el-button @click="register">注册</el-button>
        <el-button @click="handleReset">清空</el-button>
      </template>
    </el-card>
  </div>
</template>

<script setup lang='ts'>

import Cookies from 'js-cookie'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import axios from 'axios'
const user=ref({
  userName: '',
  password: '',
})

const router = useRouter()

const handleLogin = () => {
  axios.get('http://localhost:3000/sys_user', {params: user.value}).then(response => {
        if (response.data.length > 0) {
          ElMessage.success('登录成功')
          const userInfo = response.data[0]
          if(userInfo.role == '1'){
            router.push({name: 'Index'})
          }else if(userInfo.role == '2'){
            router.push({name: 'HomeView'})
          }
        }else{ElMessage.error('用户名或密码错误')}
  })
}


const register = () => {
  router.push('/register')
}

// 清空输入
const handleReset = () => {
  user.value.userName = ''
  user.value.password = ''
}
</script>
<style scoped>
.login-container {
  display: flex;
  justify-content: center;  /* 水平居中 */
  align-items: center;      /* 垂直居中 */
  min-height: 100vh;        /* 至少占满整个视口高度 */
  width: 100%;              /* 确保宽度占满 */
  margin: 0;
  padding: 20px;            /* 添加内边距防止内容贴边 */
  box-sizing: border-box;   /* 包含padding在宽度计算内 */
  background-color: #f5f5f5; /* 可选：添加背景色 */
}
</style>