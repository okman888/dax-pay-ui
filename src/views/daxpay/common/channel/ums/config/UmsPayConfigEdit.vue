<template>
  <basic-drawer
    showFooter
    v-bind="$attrs"
    width="60%"
    title="银联商务配置"
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
        <a-divider>子商户配置</a-divider>
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
        <a-form-item label="应用ID(appId)" name="umsAppId">
          <a-input v-model:value="form.umsAppId" placeholder="请输入应用ID" />
        </a-form-item>
        <a-form-item label="应用密钥(appKey)" name="appKey">
          <a-input v-model:value="form.appKey" placeholder="请输入应用密钥" />
        </a-form-item>
        <a-form-item label="商户号" name="merchantNo">
          <a-input v-model:value="form.merchantNo" placeholder="请输入商户号" />
        </a-form-item>
        <a-form-item label="终端号" name="terminalNo">
          <a-input v-model:value="form.terminalNo" placeholder="请输入终端号" />
        </a-form-item>
        <a-form-item
          label="订单号前缀"
          name="orderPrefix"
          tooltip="需要以银商分配的4位来源编号（msgSrcId）作为订单号的前4位，相当于订单号前缀"
        >
          <a-input v-model:value="form.orderPrefix" placeholder="请输入订单号前缀" />
        </a-form-item>
        <a-form-item label="通信密钥" name="secretKey" tooltip="用于回调消息验签">
          <a-input v-model:value="form.secretKey" placeholder="请输入通信密钥" />
        </a-form-item>
        <a-divider>微信认证配置</a-divider>
        <a-form-item label="微信AppId" name="wxAppId">
          <a-input
            v-model:value="form.wxAppId"
            :disabled="showable"
            placeholder="请输入微信应用AppId"
          />
        </a-form-item>
        <a-form-item label="微信AppSecret" name="wxAppSecret">
          <a-input
            v-model:value="form.wxAppSecret"
            :disabled="showable"
            placeholder="请输入微信应用wxAppSecret"
          />
        </a-form-item>
        <a-form-item
          name="wxAuthUrl"
          label="微信授权认证地址"
          tooltip="该地址需要重定向或转发到网关前端的地址，用于进行微信认证（置空将读取平台配置中的网关前端地址）"
        >
          <a-input
            v-model:value="form.wxAuthUrl"
            :disabled="showable"
            placeholder="请输入微信OAuth2认证地址"
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
  import { update, getConfig, UmsPayConfig } from './UmsPayConfig.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { useMessage } from '@/hooks/web/useMessage'
  import { BasicDrawer } from '@/components/Drawer'
  import { ChannelConfig } from '@/views/daxpay/common/merchant/config/ChannelConfig.api'
  import { findByChannel } from '@/views/daxpay/common/onboarded/OnbMchInfo.api'
  import { LabeledValue } from 'ant-design-vue/lib/select'

  const { handleCancel, diffForm, labelCol, wrapperCol, confirmLoading, visible, showable } =
    useFormEdit()
  const { createMessage } = useMessage()

  const formRef = ref<FormInstance>()
  const channelConfig = ref<ChannelConfig>({})
  const umsAppIdList = ref<LabeledValue[]>([])

  const form = ref<UmsPayConfig>({
    enable: true,
    sandbox: false,
  })
  let rawForm: any = {}
  // 校验
  const rules = computed(() => {
    return {
      umsAppId: [{ required: true, message: '请输入应用ID' }],
      appKey: [{ required: true, message: '请输入应用密钥' }],
      merchantNo: [{ required: true, message: '请输入商户号' }],
      terminalNo: [{ required: true, message: '请输入终端号' }],
      orderPrefix: [{ required: true, message: '请输入订单号前缀' }],
      enable: [{ required: true, message: '请选择是否启用' }],
      sandbox: [{ required: true, message: '请选择是否为沙箱环境' }],
      secretKey: [{ required: true, message: '请输入通信密钥' }],
    } as Record<string, Rule[]>
  })
  // 事件
  const emits = defineEmits(['ok'])
  /**
   * 入口
   */
  function init(config: ChannelConfig) {
    channelConfig.value = config
    initData()
    resetForm()
    visible.value = true
    getInfo()
  }

  /**
   * 初始化数据
   */
  function initData() {
    findByChannel(channelConfig.value.mchNo, channelConfig.value.channel).then(({ data }) => {
      umsAppIdList.value = data
    })
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
        ...diffForm(rawForm, form.value, 'appKey', 'secretKey'),
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
