<template>
  <basic-drawer
    showFooter
    v-bind="$attrs"
    width="60%"
    title="中金支付服务商配置"
    :open="visible"
    :maskClosable="false"
    @close="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        class="small-from-item"
        ref="formRef"
        :model="form"
        :rules="rules"
        :validate-trigger="['blur', 'change']"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-divider>基础配置</a-divider>
        <a-form-item label="主键" name="id" :hidden="true">
          <a-input v-model:value="form.id" />
        </a-form-item>
        <a-form-item label="是否启用" name="enable">
          <a-switch
            checked-children="启用"
            un-checked-children="停用"
            v-model:checked="form.enable"
          />
        </a-form-item>
        <a-form-item label="沙箱环境" name="sandbox">
          <a-switch checked-children="是" un-checked-children="否" v-model:checked="form.sandbox" />
        </a-form-item>
        <a-form-item label="中金机构号" name="institutionId">
          <a-input v-model:value="form.institutionId" placeholder="请输入中金机构号" />
        </a-form-item>

        <a-divider>证书配置</a-divider>
        <a-form-item label="是否使用数字信封" name="isDgEnv">
          <a-switch checked-children="是" un-checked-children="否" v-model:checked="form.isDgEnv" />
        </a-form-item>
        <a-form-item label="机构签名证书" name="keystoreFile">
          <a-input v-model:value="form.keystoreFile" placeholder="请输入签名证书路径或内容" />
        </a-form-item>
        <a-form-item label="机构签名口令" name="keystorePassword">
          <a-input-password v-model:value="form.keystorePassword" placeholder="请输入签名口令" />
        </a-form-item>
        <a-form-item label="平台公钥证书" name="certificateFile">
          <a-input
            v-model:value="form.certificateFile"
            placeholder="请输入平台公钥证书路径或内容"
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
  </basic-drawer>
</template>

<script lang="ts" setup>
  import { computed, nextTick, ref } from 'vue'
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { update, getConfig, CpcnIsvConfig } from './CpcnIsvConfig.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { useMessage } from '@/hooks/web/useMessage'
  import { BasicDrawer } from '@/components/Drawer'
  import { IsvChannelConfig } from '@/views/daxpay/admin/isv/config/channel/IsvChannelConfig.api'

  const { handleCancel, diffForm, labelCol, wrapperCol, confirmLoading, visible, showable } =
    useFormEdit()
  const { createMessage } = useMessage()

  const formRef = ref<FormInstance>()
  const channelConfig = ref<IsvChannelConfig>({})

  const form = ref<CpcnIsvConfig>({
    enable: true,
    sandbox: false,
    isDgEnv: false,
  })
  let rawForm: any = {}
  // 校验
  const rules = computed(() => {
    return {
      enable: [{ required: true, message: '请选择是否启用' }],
      sandbox: [{ required: true, message: '请选择是否为沙箱环境' }],
      institutionId: [{ required: true, message: '请输入中金机构号' }],
      //keystoreFile: [{ required: true, message: '请输入签名证书' }],
      //keystorePassword: [{ required: true, message: '请输入签名口令' }],
      //certificateFile: [{ required: true, message: '请输入平台公钥证书' }],
    } as Record<string, Rule[]>
  })
  // 事件
  const emits = defineEmits(['ok'])
  /**
   * 入口
   */
  function init(config: IsvChannelConfig) {
    channelConfig.value = config
    resetForm()
    visible.value = true
    getInfo()
  }

  /**
   * 获取信息
   */
  function getInfo() {
    getConfig(channelConfig.value.isvNo).then(({ data }) => {
      confirmLoading.value = true
      rawForm = { ...data }
      form.value = data
      confirmLoading.value = false
    })
  }
  /**
   * 更新
   */
  function handleOk() {
    formRef.value?.validate().then(() => {
      confirmLoading.value = true
      update({
        ...form.value,
        ...diffForm(rawForm, form.value, 'keystoreFile', 'keystorePassword', 'certificateFile'),
        isvNo: channelConfig.value.isvNo as string,
      })
        .then(() => {
          createMessage.success('保存成功')
          handleCancel()
          emits('ok')
        })
        .finally(() => {
          confirmLoading.value = false
        })
    })
  }
  /**
   * 重置表单
   */
  function resetForm() {
    nextTick(() => {
      formRef.value?.resetFields()
    })
  }
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
