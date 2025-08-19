<template>
  <div class="register-container">
    <el-card style="min-width: 480px; text-align: center; margin: 0 auto;">
      <template #header>
        <div class="card-header">
          <h2>注册</h2>
        </div>
      </template>
      <el-form class="register-form" label-position="left" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="user.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="user.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input type="password" v-model="user.confirmPassword" placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="user.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleRegister">注册</el-button>
        <el-button @click="handleReset">清空</el-button>
      </template>
    </el-card>
  </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const user = ref({
  userName: '',
  password: '',
  confirmPassword: '',
  email: ''
})

const handleRegister = () => {
  // 前端简单验证
  if (!user.value.userName || !user.value.password) {
    ElMessage.warning('用户名和密码不能为空')
    return
  }

  if (user.value.password !== user.value.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }

  // 发送注册请求
  axios.post("http://localhost:3000/sys_user", user.value)
      .then(response => {
        console.log(response.data)
        ElMessage.success('注册成功，请登录')
        router.push('/login')  // 注册成功跳转到登录页
      })
      .catch(error => {
        console.error("注册请求失败:", error)
        ElMessage.error('注册失败，请稍后重试')
      })
}

// 清空输入
const handleReset = () => {
  user.value.userName = ''
  user.value.password = ''
  user.value.confirmPassword = ''
  user.value.email = ''
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;  /* 水平居中 */
  align-items: center;      /* 垂直居中 */
  min-height: 100vh;        /* 至少占满整个视口高度 */
  width: 100%;              /* 确保宽度占满 */
  margin: 0;
  padding: 20px;            /* 添加内边距防止内容贴边 */
  box-sizing: border-box;   /* 包含padding在宽度计算内 */
  background-color: #f5f5f5; /* 与登录页保持一致的背景色 */
}
</style>