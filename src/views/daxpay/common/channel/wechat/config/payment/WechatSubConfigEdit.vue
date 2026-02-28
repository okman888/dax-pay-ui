<template>
  <basic-drawer
    showFooter
    v-bind="$attrs"
    width="60%"
    title="微信子商户配置"
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
          <a-input v-model:value="form.id" :disabled="showable" />
        </a-form-item>
        <a-form-item label="是否启用" name="enable">
          <a-switch
            checked-children="启用"
            un-checked-children="停用"
            v-model:checked="form.enable"
          />
        </a-form-item>
        <a-form-item
          label="微信子商户号"
          name="subMchId"
          :rules="[{ required: true, message: '请选择微信子商户号' }]"
        >
          <a-select
            v-model:value="form.subMchId"
            :disabled="showable"
            placeholder="请选择微信子商户号"
          >
            <a-select-option v-for="item in onbMchNoList" :key="item.value" :value="item.value">
              {{ `${item.label || '-'}(${item.value})` }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-divider>授权认证配置</a-divider>
        <a-form-item label="OpenId获取方式" name="authType">
          <a-radio-group v-model:value="form.authType" button-style="solid">
            <a-radio-button value="sp"> 服务商用户标识 </a-radio-button>
            <a-radio-button value="sub"> 子商户应用用户标识 </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <template v-if="form.authType == 'sub'">
          <a-form-item
            label="子商户应用号"
            name="subAppId"
            :rules="[{ required: true, message: '请输入微信子商户应用号' }]"
          >
            <a-input
              v-model:value="form.subAppId"
              :disabled="showable"
              placeholder="请输入子商户应用号"
            />
          </a-form-item>
          <a-form-item
            label="微信AppSecret"
            name="wxAppSecret"
            :rules="[{ required: true, message: '请输入微信应用AppSecret' }]"
          >
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
        </template>
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
  import { getSubConfig, updateSub, WechatPaySubConfig } from './WechatPayConfig.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { BasicDrawer } from '@/components/Drawer'
  import { useMessage } from '@/hooks/web/useMessage'
  import { ChannelConfig } from '@/views/daxpay/common/merchant/config/ChannelConfig.api'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { findByChannel } from '@/views/daxpay/common/onboarded/OnbMchInfo.api'

  const { handleCancel, labelCol, wrapperCol, confirmLoading, visible, showable } = useFormEdit()
  // 文件上传
  const { createMessage } = useMessage()

  // 表单
  const formRef = ref<FormInstance>()
  let form = ref<WechatPaySubConfig>({
    enable: true,
    authType: 'sp',
  })

  const channelConfig = ref<ChannelConfig>({})
  const onbMchNoList = ref<LabeledValue[]>([])

  // 校验
  const rules = computed(() => {
    return {
      subMchId: [{ required: true, message: '请选择微信子商户号' }],
      enable: [{ required: true, message: '请选择是否启用' }],
      authType: [{ required: true, message: '请选择OpenId获取方式' }],
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
      onbMchNoList.value = data
    })
  }

  /**
   * 获取信息
   */
  function getInfo() {
    confirmLoading.value = true
    getSubConfig(channelConfig.value.appId).then(({ data }) => {
      form.value = data
      confirmLoading.value = false
    })
  }
  /**
   * 保存
   */
  function handleOk() {
    formRef.value?.validate().then(() => {
      confirmLoading.value = true
      updateSub({
        ...form.value,
        mchNo: channelConfig.value.mchNo,
        appId: channelConfig.value.appId,
      })
        .then(() => {
          handleCancel()
          createMessage.success('保存成功')
          emits('ok')
        })
        .finally(() => {
          confirmLoading.value = false
        })
    })
  }

  // 重置表单
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
