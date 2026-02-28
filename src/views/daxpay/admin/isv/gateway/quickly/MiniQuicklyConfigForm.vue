<template>
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
      <a-form-item label="服务商号" name="isvNo" :hidden="true">
        <a-input v-model:value="form.isvNo" :disabled="showable" />
      </a-form-item>
      <a-form-item label="限制支付方式" name="limitPay">
        <a-select
          style="width: 250px"
          allow-clear
          :disabled="!edit"
          v-model:value="form.limitPay"
          :options="[{ label: '信用卡支付', value: 'no_credit' }]"
          placeholder="请选择限制用户支付的类型"
        />
      </a-form-item>
    </a-form>
    <a-space :size="55" class="flex justify-center">
      <a-button v-if="edit" @click="initData">取消</a-button>
      <a-button v-if="edit" type="primary" @click="update">
        {{ form.id ? '更新' : '保存' }}
      </a-button>
      <a-button v-if="!edit" @click="edit = true">编辑信息</a-button>
    </a-space>
  </a-spin>
</template>

<script setup lang="ts">
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { onMounted, ref } from 'vue'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import {
    IsvMiniQuicklyConfigParam,
    findByIsvNo,
    update as updateConfig,
  } from './MiniQuicklyConfig.api'
  import { useMessage } from '@/hooks/web/useMessage'

  const { labelCol, wrapperCol, confirmLoading, showable } = useFormEdit()
  const { createMessage } = useMessage()

  // 编辑状态
  const edit = ref<boolean>(false)

  // 组件属性
  const props = defineProps({
    isvNo: String,
  })

  onMounted(() => {
    initData()
  })

  // 表单
  const formRef = ref<FormInstance>()
  const form = ref<IsvMiniQuicklyConfigParam>({})

  // 表单验证规则
  const rules = {} as Record<string, Rule[]>

  /**
   * 初始化数据
   */
  function initData() {
    confirmLoading.value = true
    edit.value = false
    // 根据服务商号查询配置
    findByIsvNo(props.isvNo).then(({ data }) => {
      form.value = data
      confirmLoading.value = false
      form.value.isvNo = props.isvNo
    })
  }

  /**
   * 更新配置
   */
  function update() {
    formRef.value?.validate().then(async () => {
      confirmLoading.value = true
      updateConfig(form.value)
        .then(() => {
          edit.value = false
          createMessage.success('更新成功')
          initData()
        })
        .finally(() => (confirmLoading.value = false))
    })
  }
</script>

<style scoped lang="less"></style>
