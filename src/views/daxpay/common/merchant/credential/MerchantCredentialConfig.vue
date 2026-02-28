<template>
  <basic-drawer
    showFooter
    v-bind="$attrs"
    title="商户API配置"
    width="60%"
    :open="visible"
    :mask-closable="false"
    @close="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        ref="formRef"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="商户号" name="mchNo" required>
          <a-input v-model:value="form.mchNo" disabled />
        </a-form-item>
        <a-form-item
          label="平台公钥"
          required
          tooltip="客户可以使用平台公钥对接口返回参数、回调数据等数据进行验签，格式为RSA-SHA256"
        >
          <a-textarea
            v-model:value="form.platformPublicKey"
            placeholder="平台公钥不存在，请联系管理员处理"
            :rows="8"
            readonly
            disabled
          />
          <a-button type="link" @click="copyText(form.platformPublicKey as string)">复制</a-button>
        </a-form-item>
        <a-form-item
          label="商户公钥"
          tooltip="用户持有私钥，对数据进行签名，公钥配置给系统用于验签使用"
          name="publicKey"
        >
          <a-textarea
            v-model:value="form.publicKey"
            placeholder="请输入商户公钥（RSA-SHA256）"
            :rows="8"
            allow-clear
          />
        </a-form-item>
        <a-form-item label="通信密钥" tooltip="用于接口调用时数据加密使用" name="secretKey">
          <a-input v-model:value="form.secretKey" placeholder="请输入通信密钥" allow-clear />
          <a-button type="link" @click="genSecretKey">生成密钥</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
    <template #footer>
      <a-space>
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" :loading="confirmLoading" @click="handleOk">确定</a-button>
      </a-space>
    </template>
  </basic-drawer>
</template>

<script lang="ts" setup>
  import { nextTick, ref } from 'vue'
  import { FormInstance } from 'ant-design-vue'
  import { findByMchNo, update, MerchantCredential } from './MerchantCredential.api'
  import { BasicDrawer } from '@/components/Drawer'
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { useMessage } from '@/hooks/web/useMessage'
  import { buildUUID } from '@/utils/uuid'
  import { copyText } from '@/utils/copyTextToClipboard'

  const { handleCancel, diffForm, labelCol, wrapperCol, visible, confirmLoading } = useFormEdit()
  const { createConfirm, createMessage } = useMessage()

  const formRef = ref<FormInstance>()

  // 表单数据
  const form = ref<MerchantCredential>({})
  const rawForm = ref<MerchantCredential>({})

  // 表单验证规则
  const rules = {
    publicKey: [{ required: true, message: '请输入商户公钥', trigger: 'blur' }],
    secretKey: [{ required: true, message: '请输入通信密钥', trigger: 'blur' }],
  }

  /**
   * 初始化表单数据
   */
  function init(mchNo: string) {
    visible.value = true
    resetForm()
    form.value.mchNo = mchNo
    getInfo(mchNo)
  }

  /**
   * 获取信息
   */
  async function getInfo(mchNo: string) {
    try {
      const { data } = await findByMchNo(mchNo)
      if (data) {
        Object.assign(form.value, data)
        Object.assign(rawForm.value, data)
      }
    } catch (error) {
      console.error('获取商户API配置信息失败:', error)
    }
  }

  /**
   * 生成密钥
   */
  function genSecretKey() {
    createConfirm({
      iconType: 'info',
      title: '提示',
      content: '请确认是否生成通信密钥？',
      onOk: () => {
        form.value.secretKey = buildUUID() + buildUUID()
      },
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

  /**
   * 确定
   */
  async function handleOk() {
    try {
      await formRef.value?.validate()
      confirmLoading.value = true
      await update({
        ...form.value,
        ...diffForm(rawForm.value, form.value, 'publicKey', 'secretKey'),
      })
      createMessage.success('保存成功')
      handleCancel()
    } finally {
      confirmLoading.value = false
    }
  }

  defineExpose({
    init,
  })
</script>

<style scoped></style>
