<template>
  <basic-drawer
    showFooter
    v-bind="$attrs"
    :width="840"
    :title="title"
    :mask-closable="showable"
    :open="visible"
    @close="handleCancel"
    :loading="confirmLoading"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        class="small-from-item"
        :model="form"
        ref="formRef"
        :validate-trigger="['blur', 'change']"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="主键" name="id" :hidden="true">
          <a-input v-model:value="form.id" :disabled="showable" />
        </a-form-item>
        <a-form-item label="应用号" name="appId" v-if="!addable">
          <a-tag color="green"> {{ form.appId }}</a-tag>
        </a-form-item>
        <a-form-item label="应用名称" name="appName">
          <a-input v-model:value="form.appName" :disabled="showable" placeholder="请输入应用名称" />
        </a-form-item>
        <a-form-item label="应用状态" name="status">
          <a-switch
            :disabled="showable"
            v-model:checked="form.status"
            checked-value="enable"
            checked-children="启用"
            un-checked-value="disabled"
            un-checked-children="停用"
          />
        </a-form-item>
        <!--        <a-form-item label="通知地址" name="notifyUrl">-->
        <!--          <a-input-->
        <!--            v-model:value="form.notifyUrl"-->
        <!--            :disabled="showable"-->
        <!--            placeholder="请输入通知地址"-->
        <!--          />-->
        <!--        </a-form-item>-->
      </a-form>
    </a-spin>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button
          v-if="!showable"
          key="forward"
          :loading="confirmLoading"
          type="primary"
          @click="handleOk"
          >保存</a-button
        >
      </a-space>
    </template>
  </basic-drawer>
</template>

<script lang="ts" setup>
  import { nextTick, reactive, ref, unref } from 'vue'
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { add, get, update } from './MchApp.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '@/enums/formTypeEnum'
  import { MchApp } from '@/views/daxpay/admin/merchant/app/MchAppAdmin.api'
  import { BasicDrawer } from '@/components/Drawer'

  const {
    initFormEditType,
    handleCancel,
    labelCol,
    wrapperCol,
    title,
    confirmLoading,
    visible,
    addable,
    showable,
    formEditType,
  } = useFormEdit()

  // 表单
  const formRef = ref<FormInstance>()
  const form = ref<MchApp>({
    status: 'enable',
  })

  // 校验
  const rules = reactive({
    appName: [{ required: true, message: '请输入应用名称' }],
    status: [{ required: true, message: '请选择应用状态' }],
  } as Record<string, Rule[]>)
  // 事件
  const emits = defineEmits(['ok'])

  /**
   * 入口
   */
  function init(id, editType: FormEditType) {
    initFormEditType(editType)
    resetForm()
    getInfo(id, editType)
  }

  /**
   * 获取信息
   */
  function getInfo(id, editType: FormEditType) {
    if ([FormEditType.Edit, FormEditType.Show].includes(editType)) {
      confirmLoading.value = true
      get(id).then(({ data }) => {
        form.value = data
        confirmLoading.value = false
      })
    } else if (editType === FormEditType.Add) {
      confirmLoading.value = false
    }
  }
  // 保存
  function handleOk() {
    formRef.value?.validate().then(async () => {
      confirmLoading.value = true
      if (formEditType.value === FormEditType.Add) {
        await add(unref(form)).finally(() => (confirmLoading.value = false))
      } else if (formEditType.value === FormEditType.Edit) {
        await update(unref(form)).finally(() => (confirmLoading.value = false))
      }
      handleCancel()
      emits('ok')
    })
  }

  /**
   * 重置表单的校验
   */
  function resetForm() {
    nextTick(() => formRef.value?.resetFields())
  }
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
