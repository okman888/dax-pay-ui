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
      <a-form-item label="限制支付方式" name="limitPay">
        <a-select
          style="width: 250px"
          allow-clear
          :disabled="!edit"
          v-model:value="form.limitPay"
          :options="[{ label: '信用卡支付', value: 'no_credit' }]"
          placeholder="请选择限制用户支付的类型"
        />
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
      <a-button v-if="edit" type="primary" @click="updateConfig">
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
  import { CashierCodeConfig, findByAppId, update } from './CashierCodeConfig.api'
  import { useMessage } from '@/hooks/web/useMessage'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { useDict } from '@/hooks/bootx/useDict'
  import { findGatewayMethodByScene } from '@/views/daxpay/common/assist/basic/ChannelBasic.api'
  import { CashierSceneEnum } from '@/enums/daxpay/daxpayEnum'

  const { labelCol, wrapperCol, confirmLoading, showable } = useFormEdit()
  const { createMessage } = useMessage()
  const { dictDropDown } = useDict()

  // 编辑状态
  const edit = ref<boolean>(false)

  // 组件属性
  const props = defineProps({
    appId: String,
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
  const form = ref<CashierCodeConfig>({})

  // 表单验证规则
  const rules = {} as Record<string, Rule[]>

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
    edit.value = false
    findByAppId(props.appId).then(({ data }) => {
      form.value = data
    })
  }

  /**
   * 更新配置
   */
  function updateConfig() {
    formRef.value?.validate().then(() => {
      confirmLoading.value = true
      update(form.value)
        .then(() => {
          createMessage.success('更新成功')
          edit.value = false
          initData()
        })
        .finally(() => {
          confirmLoading.value = false
        })
    })
  }
</script>

<style scoped></style>
