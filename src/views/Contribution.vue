<template>
  <!-- 外层容器用于居中表单 -->
  <div class="form-container">
    <el-form
        :label-position="labelPosition"
        label-width="auto"
        :model="formLabelAlign"
        style="max-width: 600px"
    >
      <el-form-item label="标题" :label-position="itemLabelPosition">
        <el-input v-model="formLabelAlign.name" />
      </el-form-item>
      <el-form-item label="建议放于XX标题下" :label-position="itemLabelPosition">
        <el-input v-model="formLabelAlign.region" />
      </el-form-item>
      <el-form-item label="正文" :label-position="itemLabelPosition">
        <!-- 调整rows属性为更大的值，设置min-height确保显示多行 -->
        <el-input
            v-model="formLabelAlign.type"
            type="textarea"
            :rows="4"
        style="width: 800px"
        resize="none"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormItemProps, FormProps } from 'element-plus'

const labelPosition = ref<FormProps['labelPosition']>('right')
const itemLabelPosition = ref<FormItemProps['labelPosition']>('')
const formLabelAlign = reactive({
  name: '',
  region: '',
  type: '',
})
</script>

<style scoped>
/* 表单居中样式 */
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 30vh; /* 适当增加容器高度以容纳多行输入框 */
  padding: 20px;
}

/* 针对textarea的额外样式 */
.el-textarea__inner {
  min-height: 200px; /* 确保至少显示4行高度 */
  height: auto; /* 允许高度随内容增加 */
  line-height: 1.5; /* 优化行间距 */
}
</style>