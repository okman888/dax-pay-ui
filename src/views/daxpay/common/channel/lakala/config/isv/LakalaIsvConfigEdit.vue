<template>
  <basic-drawer
    showFooter
    v-bind="$attrs"
    width="60%"
    title="拉卡拉服务商配置"
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
        <a-form-item label="拉卡拉应用号" name="lklAppId">
          <a-input v-model:value="form.lklAppId" placeholder="请输入拉卡拉应用号" />
        </a-form-item>
        <a-form-item label="商户证书序列号" name="mchSerialNo">
          <a-input
            v-model:value="form.mchSerialNo"
            placeholder="请输入商户证书序列号(mchSerialNo)"
          />
        </a-form-item>
        <a-form-item label="拉卡拉公钥(.cer格式)" name="publicKey">
          <a-upload
            v-if="!form.publicKey"
            :disabled="showable"
            name="file"
            :multiple="false"
            :before-upload="beforeUpload"
            accept=".cer"
            :showUploadList="false"
            @change="(info) => handleChange(info, 'publicKey')"
          >
            <a-button type="primary" preIcon="carbon:cloud-upload"> 公钥证书上传 </a-button>
          </a-upload>
          <a-input v-else defaultValue="publicKey.cer" disabled>
            <template #addonAfter v-if="!showable">
              <a-tooltip>
                <template #title> 删除上传的证书文件 </template>
                <icon
                  @click="form.privateKey = ''"
                  icon="ant-design:close-circle-outlined"
                  :size="20"
                />
              </a-tooltip>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
          label="私钥证书(.pem格式)"
          name="privateKey"
          tooltip="拉卡拉提供的 private_key.pem 文件"
        >
          <a-upload
            v-if="!form.privateKey"
            :disabled="showable"
            name="file"
            :multiple="false"
            :before-upload="beforeUpload"
            accept=".pem"
            :showUploadList="false"
            @change="(info) => handleChange(info, 'privateKey')"
          >
            <a-button type="primary" preIcon="carbon:cloud-upload"> 私钥证书上传 </a-button>
          </a-upload>
          <a-input v-else defaultValue="private_key.pem" disabled>
            <template #addonAfter v-if="!showable">
              <a-tooltip>
                <template #title> 删除上传的证书文件 </template>
                <icon
                  @click="form.privateKey = ''"
                  icon="ant-design:close-circle-outlined"
                  :size="20"
                />
              </a-tooltip>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="拉卡拉sm4密钥" name="sm4Key">
          <a-input v-model:value="form.sm4Key" placeholder="请输入拉卡拉sm4密钥" />
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
  import { update, getConfig, LakalaIsvConfig } from './LakalaIsvConfig.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { useMessage } from '@/hooks/web/useMessage'
  import { BasicDrawer } from '@/components/Drawer'
  import { IsvChannelConfig } from '@/views/daxpay/admin/isv/config/channel/IsvChannelConfig.api'
  import { Icon } from '@/components/Icon'

  const { handleCancel, diffForm, labelCol, wrapperCol, confirmLoading, visible, showable } =
    useFormEdit()
  const { createMessage } = useMessage()

  const formRef = ref<FormInstance>()
  const channelConfig = ref<IsvChannelConfig>({})

  const form = ref<LakalaIsvConfig>({
    enable: true,
    sandbox: false,
  })
  let rawForm: any = {}
  // 校验
  const rules = computed(() => {
    return {
      enable: [{ required: true, message: '请选择是否启用' }],
      sandbox: [{ required: true, message: '请选择是否为沙箱环境' }],
      lklAppId: [{ required: true, message: '请输入拉卡拉应用号' }],
      mchSerialNo: [{ required: true, message: '请输入商户证书序列号' }],
      privateKey: [{ required: true, message: '请上传拉卡拉私钥证书' }],
      publicKey: [{ required: true, message: '请输入拉卡拉公钥证书' }],
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
        ...diffForm(rawForm, form.value, 'privateKey', 'publicKey', 'sm4Key'),
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
   * 阻止自动上传
   */
  function beforeUpload() {
    // 返回 false 可以阻止自动上传
    return false
  }
  /**
   * 文件上传
   */
  function handleChange(info, fieldName) {
    const file = info.file
    const reader = new FileReader()
    reader.onload = (e) => {
      // 读取结果
      form.value[fieldName] = e?.target?.result
      createMessage.success(`${info.file.name} 上传成功!`)
      formRef.value?.validateFields(fieldName)
    }
    // 读取文件为文本
    reader.readAsText(file)
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
