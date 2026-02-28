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
        <a-input v-model:value="form.id" />
      </a-form-item>
      <a-form-item label="易支付商户ID" name="pid">
        <a-input-group compact>
          <a-input-number
            v-model:value="form.pid"
            :disabled="true"
            style="width: calc(100% - 60px)"
          />
          <a-button
            :disabled="!form.pid"
            @click="copyToClipboard(form.pid?.toString() || '')"
            style="width: 60px"
            >复制</a-button
          >
        </a-input-group>
      </a-form-item>
      <a-form-item
        label="绑定商户应用"
        name="appId"
        tooltip="各种支付交易形式，读取商户的哪个应用的配置"
      >
        <a-select
          show-search
          :filter-option="search"
          :options="appOptions"
          v-model:value="form.appId"
          placeholder="请选择易支付接口所使用的商户应用"
          :disabled="!edit"
        />
      </a-form-item>
      <a-form-item label="启用状态" name="enable">
        <a-radio-group v-model:value="form.enable" :disabled="!edit" button-style="solid">
          <a-radio :value="false">停用</a-radio>
          <a-radio :value="true">启用</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="开启V1接口" name="enableV1">
        <a-radio-group v-model:value="form.enableV1" :disabled="!edit" button-style="solid">
          <a-radio :value="false">关闭</a-radio>
          <a-radio :value="true">开启</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="商户MD5密钥" name="md5Key" v-if="form.enableV1">
        <a-input-group compact>
          <a-input
            v-model:value="form.md5Key"
            :disabled="!edit"
            placeholder="请输入商户MD5密钥"
            style="width: calc(100% - 60px)"
          />
          <a-button
            :disabled="!form.md5Key"
            @click="copyToClipboard(form.md5Key)"
            style="width: 60px"
            >复制</a-button
          >
        </a-input-group>
        <a-button v-if="edit" type="link" @click="genMd5Key">生成密钥</a-button>
      </a-form-item>
      <a-form-item label="开启V2接口" name="enableV2">
        <a-radio-group v-model:value="form.enableV2" :disabled="!edit" button-style="solid">
          <a-radio :value="false">关闭</a-radio>
          <a-radio :value="true">开启</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="使用系统商户公钥" name="useSystemKey" v-if="form.enableV2">
        <a-radio-group v-model:value="form.useSystemKey" :disabled="!edit" button-style="solid">
          <a-radio :value="false">否</a-radio>
          <a-radio :value="true">是</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="RSA平台公钥" v-if="form.enableV2">
        <a-textarea
          v-model:value="form.platformPublicKey"
          :disabled="true"
          placeholder="平台公钥（系统生成）"
          :rows="5"
        />
        <a-button type="link" @click="copyToClipboard(form.platformPublicKey)"
          >复制平台公钥</a-button
        >
      </a-form-item>
      <a-form-item label="RSA商户公钥" name="publicKey" v-if="form.enableV2 && !form.useSystemKey">
        <a-textarea
          v-model:value="form.publicKey"
          :disabled="!edit"
          placeholder="请输入RSA商户公钥"
          :rows="5"
        />
        <a-button v-if="form.publicKey" type="link" @click="copyToClipboard(form.publicKey)"
          >复制商户公钥</a-button
        >
      </a-form-item>
    </a-form>
    <a-space :size="55" class="flex justify-center">
      <a-button v-if="edit" @click="handleCancel">取消</a-button>
      <a-button v-if="edit" type="primary" @click="updateConfig">更新</a-button>
      <a-button v-if="!edit" @click="edit = true">编辑信息</a-button>
    </a-space>
  </a-spin>
</template>

<script setup lang="ts">
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { ref, watch } from 'vue'
  import { Rule } from 'ant-design-vue/es/form'
  import type { FormInstance } from 'ant-design-vue'
  import { EasyPayCredential, update } from './EasyPayCredential.api'
  import { useMessage } from '@/hooks/web/useMessage'
  import { buildUUID } from '@/utils/uuid'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { dropdownEnableByMchNo as mchAppDropdownByEnable } from '@/views/daxpay/common/assist/basic/MchAppQuery.api'

  const { labelCol, wrapperCol, confirmLoading } = useFormEdit()
  const { createMessage } = useMessage()

  // 编辑状态
  const edit = ref<boolean>(false)

  // 应用选项
  const appOptions = ref<LabeledValue[]>([])

  // 组件属性
  const props = defineProps({
    credential: {
      type: Object as () => EasyPayCredential,
      default: () => ({}),
    },
  })

  // 表单
  const formRef = ref<FormInstance>()
  const form = ref<EasyPayCredential>({
    enable: false,
    enableV1: false,
    enableV2: false,
    useSystemKey: false,
  })

  /**
   * 搜索过滤函数
   */
  function search(inputValue, option) {
    return option.label.toLowerCase().includes(inputValue.toLowerCase())
  }

  // 监听凭证数据变化
  watch(
    () => props.credential,
    (newVal) => {
      if (newVal && newVal.pid) {
        form.value = { ...newVal }
        edit.value = false

        // 加载应用列表
        if (newVal.mchNo) {
          mchAppDropdownByEnable(newVal.mchNo).then(({ data }) => {
            appOptions.value = data
          })
        }
      }
    },
    { immediate: true, deep: true },
  )

  // 表单验证规则
  const rules = {
    pid: [{ required: true, message: '' }],
    enable: [{ required: true, message: '启用状态必选' }],
    appId: [{ required: true, message: '请选择易支付绑定的商户应用' }],
    enableV1: [{ required: true, message: '开启V1接口必选' }],
    enableV2: [{ required: true, message: '开启V2接口必选' }],
    useSystemKey: [{ required: true, message: '是否使用系统商户公钥必选' }],
    md5Key: [{ required: true, message: '商户MD5密钥必填' }],
    publicKey: [{ required: true, message: 'RSA商户公钥必填' }],
  } as Record<string, Rule[]>

  /**
   * 复制到剪贴板
   */
  function copyToClipboard(text?: string) {
    if (!text) return
    navigator.clipboard
      .writeText(text)
      .then(() => {
        createMessage.success('复制成功')
      })
      .catch(() => {
        createMessage.error('复制失败')
      })
  }

  /**
   * 生成MD5密钥
   */
  function genMd5Key() {
    form.value.md5Key = buildUUID()
  }

  /**
   * 取消编辑
   */
  function handleCancel() {
    form.value = { ...props.credential }
    edit.value = false
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
        })
        .finally(() => (confirmLoading.value = false))
    })
  }
</script>

<style scoped lang="less"></style>
