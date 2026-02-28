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
      <a-form-item label="应用ID" name="appId" :hidden="true">
        <a-input v-model:value="form.appId" :disabled="showable" />
      </a-form-item>
      <a-form-item label="网关支付配置是否读取系统配置" name="gatewayReadSystem">
        <a-radio-group
          v-model:value="form.gatewayReadSystem"
          :disabled="!edit"
          button-style="solid"
        >
          <a-radio :value="false">否</a-radio>
          <a-radio :value="true">是</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="H5收银台配置是否读取系统配置" name="h5ReadSystem">
        <a-radio-group v-model:value="form.h5ReadSystem" :disabled="!edit" button-style="solid">
          <a-radio :value="false">否</a-radio>
          <a-radio :value="true">是</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="PC收银台配置是否读取系统配置" name="pcReadSystem">
        <a-radio-group v-model:value="form.pcReadSystem" :disabled="!edit" button-style="solid">
          <a-radio :value="false">否</a-radio>
          <a-radio :value="true">是</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="聚合扫码支付是否读取系统配置" name="aggregateQrReadSystem">
        <a-radio-group
          v-model:value="form.aggregateQrReadSystem"
          :disabled="!edit"
          button-style="solid"
        >
          <a-radio :value="false">否</a-radio>
          <a-radio :value="true">是</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="聚合付款码是否读取系统配置" name="aggregateBarReadSystem">
        <a-radio-group
          v-model:value="form.aggregateBarReadSystem"
          :disabled="!edit"
          button-style="solid"
        >
          <a-radio :value="false">否</a-radio>
          <a-radio :value="true">是</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="小程序快捷支付是否读取系统配置" name="miniQuicklyReadSystem">
        <a-radio-group
          v-model:value="form.miniQuicklyReadSystem"
          :disabled="!edit"
          button-style="solid"
        >
          <a-radio :value="false">否</a-radio>
          <a-radio :value="true">是</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
    <a-space :size="55" class="flex justify-center">
      <a-button v-if="edit" @click="initData">取消</a-button>
      <a-button v-if="edit" type="primary" @click="updateConfig">
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
  import { GatewayPayReadConfig, getReadConfig, updateReadConfig } from './GatewayPayConfig.api'
  import { useMessage } from '@/hooks/web/useMessage'

  const { labelCol, wrapperCol, confirmLoading, showable } = useFormEdit()
  const { createMessage } = useMessage()

  // 编辑状态
  const edit = ref<boolean>(false)

  // 组件属性
  const props = defineProps({
    appId: String,
  })

  onMounted(() => {
    initData()
  })
  const emits = defineEmits(['init'])

  // 表单
  const formRef = ref<FormInstance>()
  const form = ref<GatewayPayReadConfig>({
    gatewayReadSystem: false,
    h5ReadSystem: false,
    pcReadSystem: false,
    aggregateQrReadSystem: false,
    aggregateBarReadSystem: false,
    miniQuicklyReadSystem: false,
  })

  // 表单验证规则
  const rules = {
    gatewayReadSystem: [{ required: true, message: '网关支付配置是否读取系统配置必选' }],
    h5ReadSystem: [{ required: true, message: 'H5收银台配置是否读取系统配置必选' }],
    pcReadSystem: [{ required: true, message: 'PC收银台配置是否读取系统配置必选' }],
    aggregateQrReadSystem: [{ required: true, message: '聚合扫码支付是否读取系统配置必选' }],
    aggregateBarReadSystem: [{ required: true, message: '聚合付款码是否读取系统配置必选' }],
    miniQuicklyReadSystem: [{ required: true, message: '小程序快捷支付是否读取系统配置必选' }],
  } as Record<string, Rule[]>

  /**
   * 初始化数据
   */
  function initData() {
    confirmLoading.value = true
    edit.value = false
    // 根据应用ID查询配置
    getReadConfig(props.appId).then(({ data }) => {
      form.value = data
      confirmLoading.value = false
      form.value.appId = props.appId
      emits('init', { ...data })
    })
  }

  /**
   * 更新配置
   */
  function updateConfig() {
    formRef.value?.validate().then(async () => {
      confirmLoading.value = true
      updateReadConfig(form.value)
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
