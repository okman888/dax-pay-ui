<template>
  <basic-drawer
    showFooter
    v-bind="$attrs"
    width="60%"
    title="中金支付子商户配置"
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
        <a-form-item label="机构号" name="institutionId">
          <a-input v-model:value="form.institutionId" placeholder="请输入中金支付机构号" />
        </a-form-item>
        <a-form-item label="商户号" name="merchantNo">
          <a-input v-model:value="form.merchantNo" placeholder="请输入中金支付商户号" />
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
  import { update, getConfig, SandSubConfig } from './CpcnPayConfig.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { useMessage } from '@/hooks/web/useMessage'
  import { BasicDrawer } from '@/components/Drawer'
  import { ChannelConfig } from '@/views/daxpay/common/merchant/config/ChannelConfig.api'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { findByChannel } from '@/views/daxpay/common/onboarded/OnbMchInfo.api'

  const { handleCancel, diffForm, labelCol, wrapperCol, confirmLoading, visible, showable } =
    useFormEdit()
  const { createMessage } = useMessage()

  const formRef = ref<FormInstance>()
  const channelConfig = ref<ChannelConfig>({
    enable: true,
  })
  const onbMchNoList = ref<LabeledValue[]>([])
  const form = ref<SandSubConfig>({
    enable: true,
    storeId: '100001',
    readSystem: true,
    wxChannelAuth: true,
  })
  let rawForm: any = {}
  // 校验
  const rules = computed(() => {
    return {
      onbMchNo: [{ required: true, message: '请选择杉德进件商户' }],
      enable: [{ required: true, message: '请选择是否启用' }],
      institutionId: [{ required: true, message: '请输入机构编号' }],
      merchantNo: [{ required: true, message: '请输入商户编号' }],
      storeId: [{ required: true, message: '请输入门店号' }],
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
    initData()
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
        ...diffForm(rawForm, form.value),
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
