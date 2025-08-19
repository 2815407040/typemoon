<template>
  <div class="main">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="用户名">
        <el-input v-model="formInline.user" placeholder="请输入用户名" clearable />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="formInline.email" placeholder="请输入邮箱" clearable />
      </el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form>
  </div>

  <!-- 编辑用户对话框 -->
  <el-dialog v-model="editDialogVisible" title="编辑用户" width="500px">
    <el-form :model="editForm" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="editForm.userName" disabled />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="editForm.email" />
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="editForm.role" placeholder="请选择角色">
          <el-option label="管理员" value="1" />
          <el-option label="用户" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="锁定状态">
        <el-switch
            v-model="editForm.isLocked"
            active-text="已锁定"
            inactive-text="未锁定"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="editDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitEdit">确认</el-button>
    </template>
  </el-dialog>

  <!-- 删除确认对话框 -->
  <el-dialog v-model="deleteDialogVisible" title="确认删除" width="30%">
    <span>确定要删除用户 {{ deleteUserName }} 吗？</span>
    <template #footer>
      <el-button @click="deleteDialogVisible = false">取消</el-button>
      <el-button type="danger" @click="confirmDelete">确认</el-button>
    </template>
  </el-dialog>

  <div>
    <el-table :data="pagedTableData" style="width: 100%" :border="true">
      <el-table-column type="selection" label="全选" width="150" />
      <el-table-column prop="userName" label="姓名" width="120" />
      <el-table-column prop="role" label="角色" width="120" :formatter="formatRole" />
      <el-table-column prop="email" label="邮箱" width="200" />
      <el-table-column prop="isLocked" label="锁定状态" width="90" >
        <template #default="scope">
          <div @click="toggleLockStatus(scope.row)" style="cursor: pointer">
            <el-icon v-if="scope.row.isLocked" size="20"><Lock /></el-icon>
            <el-icon v-else size="20"><Unlock /></el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column fixed="right" label="操作" min-width="180">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="handleDetail(scope.row)">
            Detail
          </el-button>
          <el-button link type="primary" size="small" @click="handleEdit(scope.row)">
            Edit
          </el-button>
          <el-button link type="danger" size="small" @click="handleDelete(scope.row)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <div>
    <div class="demo-pagination-block">
      <el-pagination
          v-model:current-page="currentPage4"
          v-model:page-size="pageSize4"
          :page-sizes="[5, 10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue'
import axios from 'axios'
import { ElMessage } from "element-plus";
import { Lock, Unlock } from '@element-plus/icons-vue'

// 定义用户数据类型
interface User {
  id: number
  userName: string
  password: string
  email: string
  role: string | number
  isLocked?: boolean
  createTime?: string
}

// 表格原始数据
const tableData = ref<User[]>([])
// 总数据条数
const totalCount = ref(0)
// 表单查询数据
const formInline = reactive({
  user: '',
  email: '',
})

// 分页参数
const currentPage4 = ref(1)
const pageSize4 = ref(5)

// 编辑对话框状态
const editDialogVisible = ref(false)
// 删除对话框状态
const deleteDialogVisible = ref(false)
// 待删除用户信息
const deleteUserId = ref(0)
const deleteUserName = ref('')
// 编辑表单数据
const editForm = ref<User>({
  id: 0,
  userName: '',
  password: '',
  email: '',
  role: '',
  isLocked: false
})

// 加载用户数据
const loadUserData = async () => {
  try {
    const response = await axios.get("http://localhost:3001/api/users")
    console.log(response.data)
    const users = response.data.map((user) => ({
      ...user,
      // 如果JSON Server中没有isLocked和createTime，添加默认值
      isLocked: user.isLocked !== undefined ? user.isLocked : Math.random() > 0.7,
      createTime: user.createTime || new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleString()
    }))
    console.log(users)
    tableData.value = users
    totalCount.value = users.length
  } catch (error) {
    console.error('加载用户数据失败:', error)
    ElMessage.error('加载数据失败，请稍后重试')
  }
}

// 分页数据计算
const pagedTableData = computed(() => {
  const filteredData = tableData.value.filter(user => {
    const matchUser = user.userName.toLowerCase().includes(formInline.user.toLowerCase())
    const matchEmail = user.email.toLowerCase().includes(formInline.email.toLowerCase())
    return matchUser && matchEmail
  })

  totalCount.value = filteredData.length

  const startIndex = (currentPage4.value - 1) * pageSize4.value
  const endIndex = startIndex + pageSize4.value
  return filteredData.slice(startIndex, endIndex)
})

// 格式化角色显示
const formatRole = (row: User) => {
  return row.role === '1' ? '管理员' : '用户'
}

// 切换锁定状态（同步到JSON Server）
const toggleLockStatus = async (row: User) => {
  try {
    row.isLocked = !row.isLocked
    await axios.patch(`http://localhost:3001/api/users/${row.id}`, {
      isLocked: row.isLocked
    })
    ElMessage.success('状态更新成功')
  } catch (error) {
    console.error('更新锁定状态失败:', error)
    row.isLocked = !row.isLocked // 失败时回滚
    ElMessage.error('更新状态失败')
  }
}

// 打开编辑对话框
const handleEdit = (row: User) => {
  editForm.value = JSON.parse(JSON.stringify(row))
  editDialogVisible.value = true
}

// 提交编辑表单（适配JSON Server的PUT请求）
const submitEdit = async () => {
  try {
    await axios.put(`http://localhost:3001/api/users/${editForm.value.id}`, editForm.value)
    // 更新本地表格数据
    const index = tableData.value.findIndex(item => item.id === editForm.value.id)
    if (index !== -1) {
      tableData.value[index] = { ...editForm.value }
    }
    ElMessage.success('编辑成功')
    editDialogVisible.value = false
  } catch (error) {
    console.error('编辑失败:', error)
    ElMessage.error('编辑失败，请稍后重试')
  }
}

// 打开删除确认对话框
const handleDelete = (row: User) => {
  deleteUserId.value = row.id
  deleteUserName.value = row.userName
  deleteDialogVisible.value = true
}

// 确认删除（适配JSON Server的DELETE请求）
const confirmDelete = async () => {
  try {
    await axios.delete(`http://localhost:3001/api/users/${deleteUserId.value}`)
    // 从本地表格数据中移除
    tableData.value = tableData.value.filter(item => item.id !== deleteUserId.value)
    ElMessage.success('删除成功')
    deleteDialogVisible.value = false
  } catch (error) {
    console.error('删除失败:', error)
    ElMessage.error('删除失败，请稍后重试')
  }
}

// 查询方法
const onSubmit = () => {
  currentPage4.value = 1
}

// 重置表单
const resetForm = () => {
  formInline.user = ''
  formInline.email = ''
  currentPage4.value = 1
}

// 详情操作,未实装
const handleDetail = (row: User) => {
  console.log('查看详情:', row)
}

// 分页相关方法
const handleSizeChange = (val: number) => {
  pageSize4.value = val
  currentPage4.value = 1
}

const handleCurrentChange = (val: number) => {
  currentPage4.value = val
}

// 页面挂载时加载数据
onMounted(() => {
  loadUserData()
})
</script>

<style>
.demo-pagination-block + .demo-pagination-block {
  margin-top: 0;
}
.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}

.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.main {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #fff;
}
</style>