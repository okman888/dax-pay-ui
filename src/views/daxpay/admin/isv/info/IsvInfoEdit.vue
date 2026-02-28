<template>
  <basic-modal
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="modalWidth"
    :title="title"
    :open="visible"
    :mask-closable="showable"
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
        <a-form-item label="服务商号" name="isvNo" v-if="!addable">
          <a-tag> {{ form.isvNo }}</a-tag>
        </a-form-item>
        <a-form-item label="服务商" name="name">
          <a-input v-model:value="form.name" :disabled="showable" placeholder="请输入服务商名称" />
        </a-form-item>
        <a-form-item label="服务商状态" name="status">
          <a-switch
            :disabled="showable"
            v-model:checked="form.status"
            checked-value="enable"
            checked-children="启用"
            un-checked-value="disabled"
            un-checked-children="停用"
          />
        </a-form-item>
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
  </basic-modal>
</template>

<script lang="ts" setup>
  import { nextTick, reactive, ref, unref } from 'vue'
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { add, get, IsvInfo, update } from './IsvInfo.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '@/enums/formTypeEnum'
  import { BasicModal } from '@/components/Modal'

  const {
    initFormEditType,
    handleCancel,
    labelCol,
    wrapperCol,
    modalWidth,
    title,
    confirmLoading,
    visible,
    addable,
    showable,
    formEditType,
  } = useFormEdit()

  // 表单
  const formRef = ref<FormInstance>()
  const form = ref<IsvInfo>({
    status: 'enable',
  })

  // 校验
  const rules = reactive({
    name: [{ required: true, message: '请输入服务商名称' }],
    status: [{ required: true, message: '请选择服务商状态' }],
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
