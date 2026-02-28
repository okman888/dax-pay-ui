<template>
  <a-modal
    v-model:visible="visible"
    title="分账订单详情"
    width="700px"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div v-if="loading" class="text-center py-10">
      <a-spin tip="加载中..." />
    </div>
    <div v-else-if="order" class="space-y-4">
      <a-row :gutter="[16, 24]">
        <a-col class="gutter-row" :span="12">
          <div class="gutterItem">
            <div class="leftTitle">分账订单号</div>
            <div class="rightContent">{{ order.settleNo }}</div>
          </div>
        </a-col>
        <a-col class="gutter-row" :span="12">
          <div class="gutterItem">
            <div class="leftTitle">原支付订单号</div>
            <div class="rightContent">
              <a @click="showPayOrder(order.payOrderNo)">{{ order.payOrderNo }}</a>
            </div>
          </div>
        </a-col>
      </a-row>
      <a-row :gutter="[16, 24]">
        <a-col class="gutter-row" :span="12">
          <div class="gutterItem">
            <div class="leftTitle">通道分账单号</div>
            <div class="rightContent">{{ order.outSettleNo || '无' }}</div>
          </div>
        </a-col>
        <a-col class="gutter-row" :span="12">
          <div class="gutterItem">
            <div class="leftTitle">支付通道</div>
            <div class="rightContent">{{ dictConvert('channel', order.channel) }}</div>
          </div>
        </a-col>
      </a-row>
      <a-row :gutter="[16, 24]">
        <a-col class="gutter-row" :span="12">
          <div class="gutterItem">
            <div class="leftTitle">分账状态</div>
            <div class="rightContent">
              <span
                :class="{
                  'text-red-500': order.status === 'fail',
                  'text-green-500': order.status === 'success',
                }"
              >
                {{ dictConvert('pay_settle_status', order.status) || '无' }}
              </span>
            </div>
          </div>
        </a-col>
        <a-col class="gutter-row" :span="12">
          <div class="gutterItem">
            <div class="leftTitle">创建时间</div>
            <div class="rightContent">{{ order.createTime }}</div>
          </div>
        </a-col>
      </a-row>
      <a-row :gutter="[16, 24]">
        <a-col class="gutter-row" :span="12">
          <div class="gutterItem">
            <div class="leftTitle">最后修改时间</div>
            <div class="rightContent">{{ order.lastModifiedTime || '无' }}</div>
          </div>
        </a-col>
      </a-row>
      <a-divider />
      <a-row :gutter="[16, 24]">
        <a-col class="gutter-row" :span="24">
          <div class="gutterItem">
            <div class="leftTitle">资金分账明细</div>
            <div class="rightContent">
              <pre>{{ order.fundSplitItems || '无' }}</pre>
            </div>
          </div>
        </a-col>
      </a-row>

      <a-row :gutter="[16, 24]">
        <a-col class="gutter-row" :span="12">
          <div class="gutterItem">
            <div class="leftTitle">通道分账结果</div>
            <div class="rightContent">{{ order.channelResult || '无' }}</div>
          </div>
        </a-col>
      </a-row>
    </div>
    <div v-else class="text-center py-10"> 分账订单不存在 </div>
    <PayOrderInfo ref="payOrderInfo" />
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { findBySettleNo } from './PaySettleOrder.api'
  import { useDict } from '@/hooks/bootx/useDict'
  import PayOrderInfo from '../pay/PayOrderInfo.vue'

  const visible = ref(false)
  const loading = ref(false)
  const order = ref<any>(null)
  const settleNo = ref('')
  const payOrderInfo = ref<any>()
  const { dictConvert } = useDict()

  // 初始化
  const init = (no: string) => {
    settleNo.value = no
    visible.value = true
    loadData()
  }

  // 加载数据
  const loadData = () => {
    if (!settleNo.value) return

    loading.value = true
    findBySettleNo(settleNo.value)
      .then(({ data }) => {
        order.value = data
      })
      .finally(() => {
        loading.value = false
      })
  }

  // 查看原支付订单
  const showPayOrder = (payOrderNo: string) => {
    payOrderInfo.value?.init(payOrderNo)
  }

  // 确定
  const handleOk = () => {
    visible.value = false
  }

  // 取消
  const handleCancel = () => {
    visible.value = false
  }

  defineExpose({
    init,
  })
</script>

<style lang="less" scoped>
  .leftTitle {
    font-weight: 500;
    color: #666;
    margin-bottom: 4px;
  }

  .rightContent {
    color: #333;
  }

  .gutterItem {
    margin-bottom: 16px;
  }

  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    background-color: #f5f5f5;
    padding: 10px;
    border-radius: 4px;
    max-height: 300px;
    overflow-y: auto;
  }
</style>
