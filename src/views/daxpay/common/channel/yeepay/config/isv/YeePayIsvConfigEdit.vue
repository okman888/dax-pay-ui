<template>
  <basic-drawer
    showFooter
    v-bind="$attrs"
    width="60%"
    title="易宝支付服务商配置"
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
        <!--        <a-form-item label="沙箱环境" name="sandbox">-->
        <!--          <a-switch checked-children="是" un-checked-children="否" v-model:checked="form.sandbox" />-->
        <!--        </a-form-item>-->
        <a-form-item label="服务商号" name="yopIsvNo">
          <a-input v-model:value="form.yopIsvNo" placeholder="请输入服务商号" />
        </a-form-item>
        <a-form-item label="应用ID" name="appKey">
          <a-input v-model:value="form.appKey" placeholder="请输入易宝应用ID" />
        </a-form-item>
        <a-form-item label="私钥" name="privateKey">
          <a-textarea v-model:value="form.privateKey" placeholder="请输入私钥" :rows="5" />
        </a-form-item>
        <a-form-item label="易宝公钥" name="yopPublicKey">
          <a-textarea v-model:value="form.yopPublicKey" placeholder="请输入易宝公钥" :rows="5" />
        </a-form-item>
        <!--        <a-form-item label="应用密钥" name="appSecret">-->
        <!--          <a-textarea v-model:value="form.appSecret" placeholder="请输入应用密钥" :rows="3" />-->
        <!--        </a-form-item>-->
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
            placeholder="请输入微信应用AppSecret"
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
  import { update, getConfig, YeePayIsvConfig } from './YeePayIsvConfig.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { useMessage } from '@/hooks/web/useMessage'
  import { BasicDrawer } from '@/components/Drawer'
  import { IsvChannelConfig } from '@/views/daxpay/admin/isv/config/channel/IsvChannelConfig.api'

  const { handleCancel, diffForm, labelCol, wrapperCol, confirmLoading, visible, showable } =
    useFormEdit()
  const { createMessage } = useMessage()

  const formRef = ref<FormInstance>()
  const channelConfig = ref<IsvChannelConfig>({})

  const form = ref<YeePayIsvConfig>({
    enable: true,
    sandbox: false,
  })
  let rawForm: any = {}

  // 校验
  const rules = computed(() => {
    return {
      enable: [{ required: true, message: '请选择是否启用' }],
      sandbox: [{ required: true, message: '请选择是否为沙箱环境' }],
      yopIsvNo: [{ required: true, message: '请输入服务商号' }],
      appKey: [{ required: true, message: '请输入应用ID' }],
      privateKey: [{ required: true, message: '请输入私钥' }],
      yopPublicKey: [{ required: true, message: '请输入易宝公钥' }],
      appSecret: [{ required: true, message: '请输入应用密钥' }],
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
        ...diffForm(rawForm, form.value, 'privateKey', 'yopPublicKey', 'appSecret'),
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
