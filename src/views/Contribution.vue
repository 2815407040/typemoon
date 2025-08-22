<template>
  <div class="contribution-container">
    <el-card>
      <template #header>
        <h2>提交贡献</h2>
      </template>

      <el-form :model="formLabelAlign" label-width="120px" class="contribution-form">
        <el-form-item label="标题">
          <el-input v-model="formLabelAlign.name" placeholder="请输入标题" />
        </el-form-item>

        <el-form-item label="索引">
          <el-input v-model="formLabelAlign.indexTitle" placeholder="请输入你希望存在哪个标题后面" />
        </el-form-item>

        <el-form-item label="内容">
          <el-input
              v-model="formLabelAlign.body"
              type="textarea"
              rows="8"
              placeholder="请输入贡献内容"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitContribution">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import Cookies from 'js-cookie';

// 表单数据
const formLabelAlign = reactive({
  name: '',
  indexTitle: '',
  body: ''
});

// 获取当前登录用户信息
const getCurrentUser = () => {
  const userCookie = Cookies.get('currentUser');
  return userCookie ? JSON.parse(userCookie) : null;
  console.log("userCookie", userCookie);
};

// 提交贡献
const submitContribution = async () => {
  // 验证表单
  if (!formLabelAlign.name) {
    ElMessage.warning('请输入名称');
    return;
  }
  if (!formLabelAlign.indexTitle) {
    ElMessage.warning('请输入标题');
    return;
  }
  if (!formLabelAlign.body) {
    ElMessage.warning('请输入内容');
    return;
  }

  // 获取当前用户
  const currentUser = getCurrentUser();
  if (!currentUser || !currentUser.id) {
    ElMessage.error('请先登录');
    return;
  }

  try {
    // 准备提交的数据
    const contributionData = {
      userId: currentUser.id,
      name: formLabelAlign.name,
      indexTitle: formLabelAlign.indexTitle,
      body: formLabelAlign.body
    };

    // 发送请求到后端
    await axios.post('http://localhost:3000/api/contributions', contributionData);
    ElMessage.success('贡献提交成功');
    resetForm();
  } catch (error) {
    console.error('提交贡献失败:', error);
    ElMessage.error('提交失败，请稍后重试');
  }
};

// 重置表单
const resetForm = () => {
  formLabelAlign.name = '';
  formLabelAlign.indexTitle = '';
  formLabelAlign.body = '';
};
</script>

<style scoped>
.contribution-container {
  padding: 20px;
}

.contribution-form {
  margin-top: 20px;
}

.el-form-item {
  margin-bottom: 20px;
}
</style>