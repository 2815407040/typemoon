<template>
  <div class="main">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="菜单名称">
        <el-input v-model="formInline.menuName" placeholder="请输入菜单名称" clearable />
      </el-form-item>
      <el-form-item label="路由路径">
        <el-input v-model="formInline.path" placeholder="请输入路由路径" clearable />
      </el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
      <el-button @click="resetForm">重置</el-button>
      <el-button type="primary" @click="handleAdd">新增</el-button>
    </el-form>
  </div>

  <!-- 编辑菜单对话框 -->
  <el-dialog v-model="editDialogVisible" :title="dialogTitle" width="500px">
    <el-form :model="editForm" label-width="80px" :rules="formRules" ref="editFormRef">
      <el-form-item label="菜单名称" prop="menuName">
        <el-input v-model="editForm.menuName" placeholder="请输入菜单名称" />
      </el-form-item>
      <el-form-item label="路由路径" prop="path">
        <el-input v-model="editForm.path" placeholder="请输入路由路径" />
      </el-form-item>
      <el-form-item label="父菜单">
        <el-select v-model="editForm.pid" placeholder="请选择父菜单">
          <el-option label="无" value="0" />
          <el-option
              v-for="menu in tableData"
              :key="menu.id"
              :label="menu.menuName"
              :value="menu.id"
              :disabled="editForm.id && menu.id === editForm.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="editDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitEdit">确认</el-button>
    </template>
  </el-dialog>

  <!-- 删除确认对话框 -->
  <el-dialog v-model="deleteDialogVisible" title="确认删除" width="30%">
    <span>确定要删除菜单 {{ deleteMenuName }} 吗？</span>
    <template #footer>
      <el-button @click="deleteDialogVisible = false">取消</el-button>
      <el-button type="danger" @click="confirmDelete">确认</el-button>
    </template>
  </el-dialog>

  <div>
    <el-table :data="filteredTableData" style="width: 100%" :border="true">
      <el-table-column type="selection" label="全选" width="150" />
      <el-table-column prop="id" label="ID" width="120" />
      <el-table-column prop="menuName" label="菜单名称" width="180" />
      <el-table-column prop="path" label="路由路径" width="200" />
      <el-table-column prop="pid" label="父菜单ID" width="120" />
      <el-table-column prop="parentName" label="父菜单名称" width="180" :formatter="formatParentName" />
      <el-table-column fixed="right" label="操作" min-width="180">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="handleDetail(scope.row)">
            详情
          </el-button>
          <el-button link type="primary" size="small" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button link type="danger" size="small" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue'
import axios from 'axios'
import { ElMessage } from "element-plus";

interface Menu {
  id: number
  menuName: string
  path: string
  pid: number
}

// 表格原始数据
const tableData = ref<Menu[]>([])
// 表单查询数据
const formInline = reactive({
  menuName: '',
  path: '',
})

// 编辑对话框状态
const editDialogVisible = ref(false)
// 对话框标题
const dialogTitle = ref('编辑菜单')
// 删除对话框状态
const deleteDialogVisible = ref(false)
// 待删除菜单信息
const deleteMenuId = ref(0)
const deleteMenuName = ref('')
// 编辑表单数据
const editForm = ref<Menu>({
  id: 0,
  menuName: '',
  path: '',
  pid: 0,
})

// 加载菜单数据
const loadMenuData = async () => {
  try {
    const response = await axios.get("http://localhost:3001/api/menus");
    console.log("原始菜单数据:", response.data);
    // 确保每个字段都有默认值，避免空值
    const menus = response.data.map((menu: any) => ({
      id: menu.id || 0,
      menuName: menu.menuName || '',
      path: menu.path || '',
      pid: menu.pid || 0,
    }));

    tableData.value = menus;
    console.log("menu数据:", tableData.value);
  } catch (error) {
    console.error('加载菜单数据失败:', error);
    ElMessage.error('加载数据失败，请稍后重试');
  }
};

// 筛选后的数据
const filteredTableData = computed(() => {
  return tableData.value.filter(menu => {
    const menuName = (menu.menuName || '').toLowerCase();
    const path = (menu.path || '').toLowerCase();
    const searchMenuName = (formInline.menuName || '').toLowerCase();
    const searchPath = (formInline.path || '').toLowerCase();

    const matchMenuName = menuName.includes(searchMenuName);
    const matchPath = path.includes(searchPath);
    return matchMenuName && matchPath;
  });
});

// 打开编辑对话框
const handleEdit = (row: Menu) => {
  dialogTitle.value = '编辑菜单'
  editForm.value = JSON.parse(JSON.stringify(row))
  editDialogVisible.value = true
}

// 打开新增对话框
const handleAdd = () => {
  dialogTitle.value = '新增菜单'
  editForm.value = {
    id: 0,
    menuName: '',
    path: '',
    pid: 0,
  }
  editDialogVisible.value = true
}

// 提交编辑表单
const submitEdit = async () => {
  try {
    // 表单验证
    if (!editForm.value.menuName.trim()) {
      ElMessage.warning('请输入菜单名称');
      return;
    }
    if (!editForm.value.path.trim()) {
      ElMessage.warning('请输入路由路径');
      return;
    }

    if (editForm.value.id) {
      // 编辑操作
      await axios.put(`http://localhost:3001/api/menus/${editForm.value.id}`, editForm.value)
      // 更新本地表格数据
      const index = tableData.value.findIndex(item => item.id === editForm.value.id)
      if (index !== -1) {
        tableData.value[index] = { ...editForm.value }
      }
      ElMessage.success('编辑成功')
    } else {
      // 新增操作
      const response = await axios.post("http://localhost:3001/api/menus", editForm.value)
      // 根据后端返回的结构调整
      tableData.value.push({
        id: response.data.id,
        menuName: editForm.value.menuName,
        path: editForm.value.path,
        pid: editForm.value.pid
      })
      ElMessage.success('新增成功')
    }
    editDialogVisible.value = false
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败，请稍后重试')
  }
}

// 打开删除确认对话框
const handleDelete = (row: Menu) => {
  deleteMenuId.value = row.id
  deleteMenuName.value = row.menuName
  deleteDialogVisible.value = true
}

// 确认删除
const confirmDelete = async () => {
  try {
    // 检查是否有子菜单
    const hasChildren = tableData.value.some(menu => menu.pid === deleteMenuId.value)
    if (hasChildren) {
      ElMessage.warning('请先删除子菜单')
      return
    }

    await axios.delete(`http://localhost:3001/api/menus/${deleteMenuId.value}`)
    // 从本地表格数据中移除
    tableData.value = tableData.value.filter(item => item.id !== deleteMenuId.value)
    ElMessage.success('删除成功')
    deleteDialogVisible.value = false
  } catch (error) {
    console.error('删除失败:', error)
    ElMessage.error('删除失败，请稍后重试')
  }
}

// 查询方法
const onSubmit = () => {
  // 触发计算属性重新计算
  console.log('查询条件:', formInline)
  // 实际项目中可以在这里调用后端接口进行查询
}

// 重置表单
const resetForm = () => {
  formInline.menuName = ''
  formInline.path = ''
}

// 详情操作
const handleDetail = (row: Menu) => {
  console.log('查看详情:', row)
  // 可以打开详情对话框展示完整信息
  ElMessage.info(`菜单ID: ${row.id}, 名称: ${row.menuName}`)
}

// 表单验证规则
const formRules = reactive({
  menuName: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  path: [
    { required: true, message: '请输入路由路径', trigger: 'blur' },
    { pattern: /^\/?[\w-\/]*$/, message: '路径格式不正确', trigger: 'blur' }
  ]
})

// 格式化父菜单名称显示
const formatParentName = (row: Menu) => {
  if (row.pid === 0) return '无'
  const parent = tableData.value.find(menu => menu.id === row.pid)
  return parent?.menuName || '未知'
}

// 表单引用
const editFormRef = ref()

// 页面挂载时加载数据
onMounted(() => {
  loadMenuData()
})
</script>

<style scoped>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.main {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #fff;
}
</style>