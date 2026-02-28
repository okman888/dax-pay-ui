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
      <a-form-item label="自动拉起支付" name="autoLaunch">
        <a-radio-group v-model:value="form.autoLaunch" :disabled="!edit" button-style="solid">
          <a-radio :value="false">否</a-radio>
          <a-radio :value="true">是</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="微信支付对应通道" name="wxChannel">
        <a-select
          v-model:value="form.wxChannel"
          :disabled="!edit"
          :options="channelList"
          allow-clear
          placeholder="请选择微信支付对应通道"
        />
      </a-form-item>
      <a-form-item label="微信支付对应支付方式" name="wxMethod" v-if="form.wxChannel">
        <a-select
          v-model:value="form.wxMethod"
          :disabled="!edit"
          :options="wxMethodList"
          allow-clear
          placeholder="请选择微信支付对应支付方式"
        />
      </a-form-item>
      <a-form-item label="支付宝支付对应通道" name="alipayChannel">
        <a-select
          v-model:value="form.alipayChannel"
          :disabled="!edit"
          :options="channelList"
          allow-clear
          placeholder="请选择支付宝支付对应通道"
        />
      </a-form-item>
      <a-form-item label="支付宝支付对应支付方式" name="alipayMethod" v-if="form.alipayChannel">
        <a-select
          v-model:value="form.alipayMethod"
          :disabled="!edit"
          :options="alipayMethodList"
          allow-clear
          placeholder="请选择支付宝支付对应支付方式"
        />
      </a-form-item>
      <a-form-item label="银联支付对应通道" name="unionChannel">
        <a-select
          v-model:value="form.unionChannel"
          :disabled="!edit"
          :options="channelList"
          allow-clear
          placeholder="请选择银联支付对应通道"
        />
      </a-form-item>
      <a-form-item label="银联支付对应支付方式" name="unionMethod" v-if="form.unionChannel">
        <a-select
          v-model:value="form.unionMethod"
          :disabled="!edit"
          :options="unionMethodList"
          allow-clear
          placeholder="请选择银联支付对应支付方式"
        />
      </a-form-item>
    </a-form>
    <a-space :size="55" class="flex justify-center">
      <a-button v-if="edit" @click="initData">取消</a-button>
      <a-button v-if="edit" type="primary" @click="update">
        {{ form.id ? '更新' : '保存' }}
      </a-button>
      <a-button v-if="!edit" @click="edit = true">编辑信息</a-button>
    </a-space>
  </a-spin>
</template>

<script setup lang="ts">
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { onMounted, ref, watch } from 'vue'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { IsvAggregatePayConfig, findQrByIsvNo, updateQrConfig } from './AggregatePayConfig.api'
  import { useMessage } from '@/hooks/web/useMessage'
  import { useDict } from '@/hooks/bootx/useDict'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { findGatewayMethodByScene } from '@/views/daxpay/common/assist/basic/ChannelBasic.api'
  import { CashierSceneEnum } from '@/enums/daxpay/daxpayEnum'

  const { labelCol, wrapperCol, confirmLoading, showable } = useFormEdit()
  const { createMessage } = useMessage()
  const { dictDropDown } = useDict()

  const edit = ref<boolean>(false)

  const props = defineProps({
    isvNo: String,
  })

  // 字典数据
  const channelList = ref<LabeledValue[]>([])
  const wxMethodList = ref<LabeledValue[]>([])
  const alipayMethodList = ref<LabeledValue[]>([])
  const unionMethodList = ref<LabeledValue[]>([])

  onMounted(() => {
    initDictData()
    initData()
  })

  // 表单
  const formRef = ref<FormInstance>()
  const form = ref<IsvAggregatePayConfig>({
    autoLaunch: true,
  })

  const rules = {
    autoLaunch: [{ required: true, message: '自动拉起支付必选' }],
  } as Record<string, Rule[]>

  /**
   * 初始化通道
   */
  async function initDictData() {
    channelList.value = await dictDropDown('channel')
  }

  // 监听通道变化，更新对应的支付方式列表
  watch(
    () => form.value.wxChannel,
    (newVal) => {
      if (newVal) {
        findGatewayMethodByScene(form.value.wxChannel, CashierSceneEnum.WECHAT_PAY).then(
          ({ data }) => {
            wxMethodList.value = data
            form.value.wxMethod = wxMethodList.value[0].value as string
          },
        )
      } else {
        wxMethodList.value = []
        form.value.wxMethod = ''
        form.value.wxChannel = ''
      }
    },
  )

  watch(
    () => form.value.alipayChannel,
    (newVal) => {
      if (newVal) {
        findGatewayMethodByScene(form.value.alipayChannel, CashierSceneEnum.ALIPAY).then(
          ({ data }) => {
            alipayMethodList.value = data
            form.value.alipayMethod = alipayMethodList.value[0].value as string
          },
        )
      } else {
        alipayMethodList.value = []
        form.value.alipayMethod = ''
        form.value.alipayChannel = ''
      }
    },
  )

  watch(
    () => form.value.unionChannel,
    (newVal) => {
      if (newVal) {
        findGatewayMethodByScene(form.value.unionChannel, CashierSceneEnum.UNION_PAY).then(
          ({ data }) => {
            unionMethodList.value = data
            form.value.unionMethod = unionMethodList.value[0].value as string
          },
        )
      } else {
        unionMethodList.value = []
        form.value.unionMethod = ''
        form.value.unionChannel = ''
      }
    },
  )

  /**
   * 初始化数据
   */
  function initData() {
    confirmLoading.value = true
    edit.value = false
    // 获取配置
    findQrByIsvNo(props.isvNo).then(({ data }) => {
      form.value = data
      confirmLoading.value = false
      form.value.isvNo = props.isvNo
    })
  }

  /**
   * 更新配置
   */
  function update() {
    formRef.value?.validate().then(async () => {
      confirmLoading.value = true
      updateQrConfig(form.value)
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
