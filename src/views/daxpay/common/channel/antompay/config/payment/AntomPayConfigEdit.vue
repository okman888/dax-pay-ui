<template>
  <basic-drawer
    showFooter
    v-bind="$attrs"
    width="60%"
    title="AntomPay支付配置"
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
        <a-form-item
          name="clientId"
          label="客户端ID"
          tooltip="Antom支付网关分配的客户端ID，用于标识商户身份"
        >
          <a-input v-model:value="form.clientId" placeholder="请输入Antom客户端ID" />
        </a-form-item>
        <a-form-item label="沙箱环境" name="sandbox">
          <a-switch checked-children="是" un-checked-children="否" v-model:checked="form.sandbox" />
        </a-form-item>
        <a-form-item label="商户私钥" name="merchantPrivateKey">
          <a-textarea
            :rows="5"
            v-model:value="form.merchantPrivateKey"
            placeholder="请输入商户私钥"
          />
        </a-form-item>
        <a-form-item label="平台公钥" name="antomPublicKey">
          <a-textarea
            :rows="5"
            v-model:value="form.antomPublicKey"
            placeholder="请输入Antom公钥"
          />
        </a-form-item>
        <a-form-item
          label="支付网关地址"
          name="gatewayUrl"
          tooltip="Antom支付网关地址，为空则使用默认网关地址"
        >
          <a-input v-model:value="form.gatewayUrl" placeholder="请输入支付网关地址，留空使用默认地址" />
        </a-form-item>
        <a-form-item
          label="支付结果通知URL"
          name="notifyUrl"
          tooltip="支付成功后，Antom会向该地址发送异步通知"
        >
          <a-input v-model:value="form.notifyUrl" placeholder="请输入支付结果通知URL" />
        </a-form-item>
        <a-form-item
          label="同步跳转URL"
          name="returnUrl"
          tooltip="支付完成后，用户浏览器跳转回商户页面的地址"
        >
          <a-input v-model:value="form.returnUrl" placeholder="请输入同步跳转URL" />
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
  import { update, getConfig, AntomPayConfig } from './AntomPayConfig.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { useMessage } from '@/hooks/web/useMessage'
  import { BasicDrawer } from '@/components/Drawer'
  import { ChannelConfig } from '@/views/daxpay/common/merchant/config/ChannelConfig.api'

  const { handleCancel, diffForm, labelCol, wrapperCol, confirmLoading, visible, showable } =
    useFormEdit()
  const { createMessage } = useMessage()

  const formRef = ref<FormInstance>()
  const channelConfig = ref<ChannelConfig>({})

  const form = ref<AntomPayConfig>({
    clientId: '',
    enable: true,
    merchantPrivateKey: '',
    antomPublicKey: '',
    gatewayUrl: '',
    sandbox: false,
    notifyUrl: '',
    returnUrl: '',
  })
  let rawForm: any = {}
  // 校验
  const rules = computed(() => {
    return {
      enable: [{ required: true, message: '请选择是否启用' }],
      clientId: [{ required: true, message: '请输入Antom客户端ID' }],
      merchantPrivateKey: [{ required: true, message: '请输入商户私钥' }],
      antomPublicKey: [{ required: true, message: '请输入Antom公钥' }],
    } as Record<string, Rule[]>
  })
  // 事件
  const emits = defineEmits(['ok'])
  /**
   * 入口
   */
  function init(config: ChannelConfig) {
    channelConfig.value = config
    resetForm()
    visible.value = true
    getInfo()
  }

  /**
   * 获取信息
   */
  function getInfo() {
    getConfig(channelConfig.value.appId).then(({ data }) => {
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
        ...diffForm(
          rawForm,
          form.value,
          'merchantPrivateKey',
          'antomPublicKey',
        ),
        mchNo: channelConfig.value.mchNo,
        appId: channelConfig.value.appId,
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
