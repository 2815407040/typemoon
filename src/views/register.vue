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
  axios.post("http://localhost:3001/api/users/register", user.value)
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
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  margin: 0;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f5f5f5;
}
</style>