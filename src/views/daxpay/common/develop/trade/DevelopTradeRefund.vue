<template>
  <div>
    <a-spin :spinning="confirmLoading">
      <a-form
        class="small-from-item w-40vw"
        ref="formRef"
        :model="form"
        :rules="rules"
        :labelCol="{ span: 6 }"
        :wrapperCol="{ span: 18 }"
        :validate-trigger="['blur', 'change']"
      >
        <a-form-item label="商户私钥" required>
          <a-space>
            <a-button size="small" @click="showPrivateKeyModal" type="primary">设置私钥</a-button>
            <a-button size="small" v-if="privateKey" @click="clearPrivateKey" danger
              >清除私钥</a-button
            >
          </a-space>
        </a-form-item>
        <a-form-item label="商户" name="mchNo">
          <a-select
            show-search
            :filter-option="search"
            v-model:value="form.mchNo"
            placeholder="请选择商户"
            :options="mchNoOptions"
            @change="merchantChange"
          />
        </a-form-item>
        <a-form-item label="应用" name="appId">
          <a-select
            show-search
            :filter-option="search"
            :options="mchAppOptions"
            v-model:value="form.appId"
            placeholder="请选择商户应用"
          />
        </a-form-item>
        <a-form-item label="退款号" name="bizRefundNo">
          <a-input-group compact>
            <a-input
              v-model:value="form.bizRefundNo"
              placeholder="请输入订单号"
              style="width: calc(100% - 60px)"
            />
            <a-button @click="genBizOrderNo">生成</a-button>
          </a-input-group>
        </a-form-item>
        <a-form-item label="订单号" name="orderNo">
          <a-input v-model:value="form.orderNo" placeholder="请输入支付订单号" />
        </a-form-item>
        <a-form-item label="商户订单号" name="bizOrderNo">
          <a-input v-model:value="form.bizOrderNo" placeholder="请输入商户支付订单号" />
        </a-form-item>
        <a-form-item label="退款原因" name="reason">
          <a-input v-model:value="form.reason" placeholder="请输入退款原因" />
        </a-form-item>
        <a-form-item label="退款金额" name="amount">
          <a-input-number
            v-model:value="form.amount"
            :min="0.01"
            :precision="2"
            placeholder="请输入退款金额"
          />
        </a-form-item>
        <a-form-item label="退款扩展参数" name="extraParam">
          <a-textarea v-model:value="form.extraParam" :rows="3" placeholder="请输入退款扩展参数" />
        </a-form-item>
        <a-form-item label="商户扩展参数" name="attach">
          <a-textarea v-model:value="form.attach" :rows="3" placeholder="请输入商户扩展参数" />
        </a-form-item>
        <a-form-item label="异步通知地址" name="notifyUrl">
          <a-input v-model:value="form.notifyUrl" placeholder="请输入异步通知地址" />
        </a-form-item>
        <a-form-item label="终端IP" name="clientIp">
          <a-input v-model:value="form.clientIp" placeholder="请输入终端IP地址" />
        </a-form-item>
        <a-form-item label="随机数" name="nonceStr">
          <a-input-group compact>
            <a-input
              v-model:value="form.nonceStr"
              style="width: calc(100% - 60px)"
              placeholder="请输入随机数"
            />
            <a-button @click="genNonceStr">生成</a-button>
          </a-input-group>
        </a-form-item>
        <a-form-item label="请求时间" name="reqTime">
          <a-input-group compact>
            <a-input disabled v-model:value="form.reqTime" style="width: calc(100% - 60px)" />
            <a-button @click="updateReqTime">更新</a-button>
          </a-input-group>
        </a-form-item>
        <a-form-item label="签名" name="sign">
          <a-input-group compact>
            <a-input
              placeholder="请输入签名"
              v-model:value="form.sign"
              style="width: calc(100% - 60px)"
            />
            <a-button @click="getSign">生成</a-button>
          </a-input-group>
        </a-form-item>
        <a-space style="display: flex; justify-content: center">
          <a-button @click="handleReset">重置表单</a-button>
          <a-button type="primary" @click="handleSubmit">提交请求</a-button>
        </a-space>
      </a-form>
    </a-spin>

    <!-- 设置私钥弹窗 -->
    <a-modal
      v-model:visible="privateKeyVisible"
      title="设置商户私钥"
      @ok="savePrivateKey"
      :maskClosable="false"
    >
      <a-textarea
        v-model:value="privateKeyInput"
        placeholder="请输入商户私钥"
        :rows="6"
        allow-clear
      />
    </a-modal>
  </div>
</template>
<script setup lang="ts">
  import { computed, onMounted, reactive, ref } from 'vue'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { Modal, message } from 'ant-design-vue'
  import { refundSign, RefundParam, tradeRefund } from './DevelopTrade.api'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { dropdownByEnable as dropdownByEnable } from '@/views/daxpay/common/assist/basic/MerchantQuery.api'
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { dropdownEnableByMchNo as mchAppDropdownByEnable } from '@/views/daxpay/common/assist/basic/MchAppQuery.api'
  import XEUtils from 'xe-utils'
  import { buildShortUUID, buildUUID } from '@/utils/uuid'

  const { search } = useFormEdit()

  // 商户私钥存储在localStorage中的键名
  const PRIVATE_KEY_STORAGE_KEY = 'daxpay_refund_private_key'

  // 添加商户私钥相关状态
  const privateKey = ref<string>('')
  const privateKeyVisible = ref<boolean>(false)
  const privateKeyInput = ref<string>('')

  const confirmLoading = ref(false)
  const formRef = ref<FormInstance>()
  const form = reactive<RefundParam>({
    clientIp: '127.0.0.1',
    amount: 0.01,
  })
  const rules = computed(() => {
    return {
      mchNo: [{ required: true, message: '商户不可为空' }],
      appId: [{ required: true, message: '应用不可为空' }],
      bizRefundNo: [{ required: true, message: '商户退款号不可为空' }],
      title: [{ required: true, message: '退款标题不可为空' }],
      amount: [{ required: true, message: '退款金额不可为空' }],
      clientIp: [{ required: true, message: '终端IP不可为空' }],
      nonceStr: [{ required: true, message: '随机数不可为空' }],
      reqTime: [{ required: true, message: '请求时间不可为空' }],
    } as Record<string, Rule[]>
  })

  const mchNoOptions = ref<LabeledValue[]>([])
  const mchAppOptions = ref<LabeledValue[]>([])

  onMounted(() => {
    // 从localStorage中读取私钥
    const savedPrivateKey = localStorage.getItem(PRIVATE_KEY_STORAGE_KEY)
    if (savedPrivateKey) {
      privateKey.value = savedPrivateKey
    }
    initData()
  })

  /**
   * 初始化数据
   */
  async function initData() {
    confirmLoading.value = false
    dropdownByEnable().then(({ data }) => {
      mchNoOptions.value = data
    })
    // 时间默认30M后
    genNonceStr()
    genBizOrderNo()
    updateReqTime()
  }

  /**
   * 商户变动时刷新应用列表
   */
  function merchantChange() {
    form.appId = undefined
    mchAppDropdownByEnable(form.mchNo).then(({ data }) => {
      mchAppOptions.value = data
    })
  }

  /**
   * 生成订单号
   */
  function genBizOrderNo() {
    form.bizRefundNo = buildShortUUID('REFUND')
  }

  /**
   * 生成随机数
   */
  function genNonceStr() {
    form.nonceStr = buildUUID()
  }

  /**
   * 更新请求时间
   */
  function updateReqTime() {
    form.reqTime = XEUtils.toDateString(new Date(), 'yyyy-MM-dd HH:mm:ss')
  }
  /**
   * 获取签名
   */
  function getSign() {
    formRef.value?.validate().then(() => {
      refundSign(form, privateKey.value).then(({ data }) => {
        form.sign = data
      })
    })
  }

  /**
   * 显示设置私钥弹窗
   */
  function showPrivateKeyModal() {
    privateKeyInput.value = privateKey.value || ''
    privateKeyVisible.value = true
  }

  /**
   * 保存私钥
   */
  function savePrivateKey() {
    privateKey.value = privateKeyInput.value
    // 保存到localStorage
    if (privateKey.value) {
      localStorage.setItem(PRIVATE_KEY_STORAGE_KEY, privateKey.value)
    } else {
      localStorage.removeItem(PRIVATE_KEY_STORAGE_KEY)
    }
    privateKeyVisible.value = false
    message.success('私钥保存成功')
  }

  /**
   * 清除私钥
   */
  function clearPrivateKey() {
    privateKey.value = ''
    // 从localStorage中移除
    localStorage.removeItem(PRIVATE_KEY_STORAGE_KEY)
    message.success('私钥已清除')
  }

  /**
   * 重置
   */
  function handleReset() {
    formRef.value?.resetFields()
    initData()
  }

  /**
   * 提交
   */
  function handleSubmit() {
    formRef.value?.validate().then(() => {
      confirmLoading.value = true
      tradeRefund(form, privateKey.value)
        .then(({ data }) => {
          Modal.info({
            title: '响应结果',
            content: `${JSON.stringify(data)}`,
          })
        })
        .finally(() => {
          confirmLoading.value = false
        })
    })
  }
</script>

<style scoped lang="less"></style>
