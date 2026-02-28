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
      <a-form-item label="PC收银台是否显示聚合二维码" name="aggregateQrShow">
        <a-radio-group v-model:value="form.aggregateQrShow" :disabled="!edit" button-style="solid">
          <a-radio :value="false">不显示</a-radio>
          <a-radio :value="true">显示</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label="H5收银台自动升级聚合扫码支付"
        name="h5AutoUpgrade"
      >
        <a-radio-group v-model:value="form.h5AutoUpgrade" :disabled="!edit" button-style="solid">
          <a-radio :value="false">不升级</a-radio>
          <a-radio :value="true">自动升级</a-radio>
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
  import { GatewayPayConfig, getConfig, update } from './GatewayPayConfig.api'
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

  // 表单
  const formRef = ref<FormInstance>()
  const form = ref<GatewayPayConfig>({
    aggregateQrShow: false,
    h5AutoUpgrade: false,
  })

  // 表单验证规则
  const rules = {
    aggregateQrShow: [{ required: true, message: '聚合二维码是否显示必选' }],
    h5AutoUpgrade: [{ required: true, message: 'H5收银台自动升级聚合扫码支付必选' }],
  } as Record<string, Rule[]>

  /**
   * 初始化数据
   */
  function initData() {
    confirmLoading.value = true
    edit.value = false
    // 根据应用ID查询配置
    getConfig(props.appId).then(({ data }) => {
      form.value = data
      confirmLoading.value = false
      form.value.appId = props.appId
    })
  }

  /**
   * 更新配置
   */
  function updateConfig() {
    formRef.value?.validate().then(async () => {
      confirmLoading.value = true
      update(form.value)
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
