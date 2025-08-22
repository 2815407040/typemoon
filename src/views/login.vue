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

const router = useRouter()
const user = ref({
  userName: '',
  password: ''
})

const handleLogin = () => {
  // 前端简单验证
  if (!user.value.userName || !user.value.password) {
    ElMessage.warning('用户名和密码不能为空')
    return
  }

  // 改用POST请求，使用正确的登录接口地址
  axios.post("http://localhost:3000/api/users/login", user.value,{
    headers: {
      'Content-Type': 'application/json'
    }
  })
      .then(response => {
        console.log(response.data)
        // 后端返回格式是 { message: '登录成功', user: userInfo }
        if (response.data.user) {
          ElMessage.success('登录成功')
          const userInfo = response.data.user

          Cookies.set('currentUser', JSON.stringify(userInfo), { expires: 1, path: '/' })

          // 获取角色信息并跳转
          const role = userInfo.role
          if (role === '1') {
            router.push('/index')
          } else if (role === '2') {
            router.push('/HomeView')
          }else if (role === '0') {
            router.push('/index')
          }
        } else {
          ElMessage.error(response.data.message || '登录失败')
        }
      })
      .catch(error => {
        console.error("登录请求失败:", error);
        // 打印服务器返回的具体错误信息
        console.log("服务器响应:", error.response?.data);
        console.log("状态码:", error.response?.status);
        console.log("响应头:", error.response?.headers);

        ElMessage.error(
            error.response?.data?.message ||
            '登录失败，请检查用户名和密码'
        );
      });
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