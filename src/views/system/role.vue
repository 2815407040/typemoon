<template>
  <div class="main">
    <el-form :inline="true"  class="demo-form-inline">
      <el-form-item label="角色名">
        <el-input  placeholder="请输入角色名" clearable />
      </el-form-item>
      <el-button type="primary" @click="">查询</el-button>
      <el-button @click="">新增</el-button>
    </el-form>
  </div>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="id" label="角色ID" width="150" />
    <el-table-column prop="roleName" label="角色名" width="150" />
    <el-table-column prop="roleDescribe"label="角色描述" width="220" />
    <el-table-column  label="操作" min-width="120">
      <template #default>
        <el-button link type="primary" size="small" @click="handleEdit">编辑</el-button>
        <el-button link type="primary" size="small" @click="">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="editDialogVisible" title="编辑角色" width="500px">

  </el-dialog>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, computed } from 'vue'
import axios from 'axios'
import { ElMessage } from "element-plus";

interface Role {
  id: number
  roleName: string
  roleDescribe: string
}

const tableData = ref<Role[]>([])

const editDialogVisible = ref(false)

const editForm = ref<Role>({
  id: 0,
  roleName: '',
  roleDescribe: '',
})

onMounted(() => {
  loadRoleData()
})

const loadRoleData = async () => {
  try {
    const response = await axios.get("http://localhost:3000/sys_role")
    const roles = response.data
    console.log("接口返回原始数据:", response.data)
    tableData.value = roles
  } catch (error) {
    console.error('加载用户数据失败:', error)
    ElMessage.error('加载数据失败，请稍后重试')
  }
}

const handleEdit = (row: Role) => {
  editForm.value = JSON.parse(JSON.stringify(row))
  editDialogVisible.value = true
}

</script>