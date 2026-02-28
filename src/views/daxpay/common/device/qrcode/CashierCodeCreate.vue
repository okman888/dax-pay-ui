<template>
  <basic-modal
    title="码牌批量生成"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="750"
    :open="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
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
        <a-form-item label="批次号" name="batchNo" validate-first>
          <a-input-group compact>
            <a-input
              v-model:value="form.batchNo"
              placeholder="请输入码牌批次号"
              style="width: calc(100% - 60px)"
            />
            <a-button type="primary" @click="genBatchNo">生成</a-button>
          </a-input-group>
        </a-form-item>
        <a-form-item label="数量" name="count">
          <a-input-number
            v-model:value="form.count"
            :precision="0"
            min="1"
            max="999"
            placeholder="请输入要创建码牌的数量"
          />
        </a-form-item>
        <a-form-item label="金额类型" name="amountType">
          <a-select v-model:value="form.amountType" placeholder="请选择金额类型">
            <a-select-option value="fixed">固定金额</a-select-option>
            <a-select-option value="random">任意金额</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="金额" name="amount" v-if="form.amountType === 'fixed'">
          <a-input-number
            v-model:value="form.amount"
            :precision="2"
            :min="0.01"
            :max="999999"
            placeholder="请输入金额"
          />
        </a-form-item>
        <a-form-item label="状态" name="enable">
          <a-radio-group v-model:value="form.enable">
            <a-radio :value="true">启用</a-radio>
            <a-radio :value="false">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="读取系统配置" name="readSystem">
          <a-radio-group v-model:value="form.readSystem">
            <a-radio :value="true">读取</a-radio>
            <a-radio :value="false">自定义</a-radio>
          </a-radio-group>
        </a-form-item>

        <template v-if="!form.readSystem">
          <a-form-item label="微信支付对应通道" name="wxChannel">
            <a-select
              v-model:value="form.wxChannel"
              :disabled="showable"
              :options="channelList"
              allow-clear
              placeholder="请选择微信支付对应通道"
            />
          </a-form-item>
          <a-form-item label="微信支付对应支付方式" name="wxMethod" v-if="form.wxChannel">
            <a-select
              v-model:value="form.wxMethod"
              :disabled="showable"
              :options="wxMethodList"
              allow-clear
              placeholder="请选择微信支付对应支付方式"
            />
          </a-form-item>
          <a-form-item label="支付宝支付对应通道" name="alipayChannel">
            <a-select
              v-model:value="form.alipayChannel"
              :disabled="showable"
              :options="channelList"
              allow-clear
              placeholder="请选择支付宝支付对应通道"
            />
          </a-form-item>
          <a-form-item label="支付宝支付对应支付方式" name="alipayMethod" v-if="form.alipayChannel">
            <a-select
              v-model:value="form.alipayMethod"
              :disabled="showable"
              :options="alipayMethodList"
              allow-clear
              placeholder="请选择支付宝支付对应支付方式"
            />
          </a-form-item>
          <a-form-item label="银联支付对应通道" name="unionChannel">
            <a-select
              v-model:value="form.unionChannel"
              :disabled="showable"
              :options="channelList"
              allow-clear
              placeholder="请选择银联支付对应通道"
            />
          </a-form-item>
          <a-form-item label="银联支付对应支付方式" name="unionMethod" v-if="form.unionChannel">
            <a-select
              v-model:value="form.unionMethod"
              :disabled="showable"
              :options="unionMethodList"
              allow-clear
              placeholder="请选择银联支付对应支付方式"
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
          >生成</a-button
        >
      </a-space>
    </template>
  </basic-modal>
</template>

<script setup lang="ts">
  import { BasicModal } from '@/components/Modal'
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { computed, nextTick, ref, watch } from 'vue'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { CashierCodeBatch, createBatch, existsByBatchNo } from './CashierCode.api'
  import { useMessage } from '@/hooks/web/useMessage'
  import dayjs from 'dayjs'
  import { useDict } from '@/hooks/bootx/useDict'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { findGatewayMethodByScene } from '@/views/daxpay/common/assist/basic/ChannelBasic.api'
  import { CashierSceneEnum } from '@/enums/daxpay/daxpayEnum'

  const { handleCancel, confirmLoading, visible, showable, labelCol, wrapperCol } = useFormEdit()
  const { createMessage } = useMessage()
  const { dictDropDown } = useDict()

  const formRef = ref<FormInstance>()
  let form = ref<CashierCodeBatch>({
    enable: true,
    readSystem: true,
    count: 1,
    amountType: 'random',
  })

  // 字典数据
  const channelList = ref<LabeledValue[]>([])
  const wxMethodList = ref<LabeledValue[]>([])
  const alipayMethodList = ref<LabeledValue[]>([])
  const unionMethodList = ref<LabeledValue[]>([])

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

  // 校验
  const rules = computed(() => {
    return {
      batchNo: [
        { required: true, message: '请输入批次号' },
        { validator: checkBatchNo, trigger: 'blur' },
      ],
      count: [{ required: true, message: '请输入要创建码牌的数量' }],
      enable: [{ required: true, message: '请选择码牌是否启用' }],
      readSystem: [{ required: true, message: '请选择码牌是否读取系统配置' }],
      amountType: [{ required: true, message: '请选择金额类型' }],
      amount: [{ required: true, message: '请输入收款金额' }],
    } as Record<string, Rule[]>
  })

  // 事件
  const emits = defineEmits(['ok'])

  /**
   * 入口
   */
  function init() {
    initData()
    resetForm()
    visible.value = true
    confirmLoading.value = false
  }

  /**
   * 初始化数据
   */
  async function initData() {
    channelList.value = await dictDropDown('channel')
  }

  /**
   * 创建
   */
  function handleOk() {
    formRef.value?.validate().then(() => {
      confirmLoading.value = true
      createBatch(form.value).then(() => {
        createMessage.success('创建成功')
        confirmLoading.value = false
        emits('ok', form.value)
        handleCancel()
      })
    })
  }

  /**
   * 生成批次号
   */
  function genBatchNo() {
    form.value.batchNo = dayjs().format('YYMMDDHHMMss')
    formRef.value?.validateFields(['batchNo'])
  }
  /**
   * 批次号检查
   */
  async function checkBatchNo() {
    const { data } = await existsByBatchNo(form.value.batchNo)
    return data ? Promise.reject('批次号已存在!') : Promise.resolve()
  }

  /**
   * 重置表单的校验
   */
  function resetForm() {
    nextTick(() => formRef.value?.resetFields())
  }

  defineExpose({ init })
</script>

<style scoped lang="less"></style>
