<template>
  <div class="grow-card-wrapper">
    <a-row :gutter="[16, 16]">
      <!-- 左侧统计卡片区域 -->
      <a-col :xs="24" :sm="24" :md="24" :lg="16">
        <a-row :gutter="[16, 16]">
          <!-- 第1行：商户数量、应用数量 -->
          <!-- 商户数量 -->
          <a-col :xs="12" :sm="12" :md="12" :lg="12">
            <div class="stat-card stat-card--teal">
              <div class="stat-card__icon">
                <Icon icon="shop-outlined" :size="28" />
              </div>
              <div class="stat-card__content">
                <div class="stat-card__title">商户数量</div>
                <div class="stat-card__value">
                  <CountTo :startVal="0" :endVal="mchData.normalCount || 0" />
                </div>
              </div>
            </div>
          </a-col>

          <!-- 应用数量 -->
          <a-col :xs="12" :sm="12" :md="12" :lg="12">
            <div class="stat-card stat-card--amber">
              <div class="stat-card__icon">
                <Icon icon="appstore-outlined" :size="28" />
              </div>
              <div class="stat-card__content">
                <div class="stat-card__title">应用数量</div>
                <div class="stat-card__value">
                  <CountTo :startVal="0" :endVal="mchData.normalAppCount || 0" />
                </div>
              </div>
            </div>
          </a-col>

          <!-- 第2行：支付订单数、支付订单金额 -->
          <!-- 支付订单数 -->
          <a-col :xs="12" :sm="12" :md="12" :lg="12">
            <div class="stat-card stat-card--blue">
              <div class="stat-card__icon">
                <Icon icon="shopping-cart-outlined" :size="28" />
              </div>
              <div class="stat-card__content">
                <div class="stat-card__title">支付订单数</div>
                <div class="stat-card__value">
                  <CountTo :startVal="0" :endVal="payData.tradeCount || 0" />
                </div>
              </div>
            </div>
          </a-col>

          <!-- 支付订单金额 -->
          <a-col :xs="12" :sm="12" :md="12" :lg="12">
            <div class="stat-card stat-card--purple">
              <div class="stat-card__icon">
                <Icon icon="money-collect-outlined" :size="28" />
              </div>
              <div class="stat-card__content">
                <div class="stat-card__title">支付订单金额</div>
                <div class="stat-card__value">
                  <span class="stat-card__prefix">¥</span>
                  <CountTo :startVal="0" :endVal="payData.tradeAmount || 0" :precision="2" />
                </div>
              </div>
            </div>
          </a-col>

          <!-- 第3行：退款订单数、退款订单金额 -->
          <!-- 退款订单数 -->
          <a-col :xs="12" :sm="12" :md="12" :lg="12">
            <div class="stat-card stat-card--red">
              <div class="stat-card__icon">
                <Icon icon="rollback-outlined" :size="28" />
              </div>
              <div class="stat-card__content">
                <div class="stat-card__title">退款订单数</div>
                <div class="stat-card__value">
                  <CountTo :startVal="0" :endVal="refundData.tradeCount || 0" />
                </div>
              </div>
            </div>
          </a-col>

          <!-- 退款订单金额 -->
          <a-col :xs="12" :sm="12" :md="12" :lg="12">
            <div class="stat-card stat-card--pink">
              <div class="stat-card__icon">
                <Icon icon="retweet-outlined" :size="28" />
              </div>
              <div class="stat-card__content">
                <div class="stat-card__title">退款订单金额</div>
                <div class="stat-card__value">
                  <span class="stat-card__prefix">¥</span>
                  <CountTo :startVal="0" :endVal="refundData.tradeAmount || 0" :precision="2" />
                </div>
              </div>
            </div>
          </a-col>

          <!-- 第4行：提现订单数、提现金额 -->
          <!-- 提现订单数 -->
          <a-col :xs="12" :sm="12" :md="12" :lg="12">
            <div class="stat-card stat-card--cyan">
              <div class="stat-card__icon">
                <Icon icon="transaction-outlined" :size="28" />
              </div>
              <div class="stat-card__content">
                <div class="stat-card__title">提现订单数</div>
                <div class="stat-card__value">
                  <CountTo :startVal="0" :endVal="withdrawData.tradeCount || 0" />
                </div>
              </div>
            </div>
          </a-col>

          <!-- 提现金额 -->
          <a-col :xs="12" :sm="12" :md="12" :lg="12">
            <div class="stat-card stat-card--orange">
              <div class="stat-card__icon">
                <Icon icon="minus-circle-outlined" :size="28" />
              </div>
              <div class="stat-card__content">
                <div class="stat-card__title">提现金额</div>
                <div class="stat-card__value">
                  <span class="stat-card__prefix">¥</span>
                  <CountTo :startVal="0" :endVal="withdrawData.tradeAmount || 0" :precision="2" />
                </div>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-col>

      <!-- 右侧通知公告区域 -->
      <a-col :xs="24" :sm="24" :md="24" :lg="8">
        <div class="notice-card">
          <div class="notice-card__header">
            <Icon icon="bell-outlined" :size="20" />
            <span class="notice-card__title">通知公告</span>
          </div>
          <div class="notice-card__content">
            <div class="notice-item" v-for="item in 5" :key="item">
              <div class="notice-item__dot"></div>
              <div class="notice-item__text">公告功能现在尚未开发完成，请耐心等待！</div>
              <div class="notice-item__date">2025-06-01</div>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import { CountTo } from '@/components/CountTo'
  import { Icon } from '@/components/Icon'
  import { reactive, ref, watch } from 'vue'
  import {
    merchantCountReport,
    MerchantReportResult,
    payTradeReport,
    rfdTradeReport,
    withdrawTradeReport,
    TradeReportResult,
  } from '../IndexRepot.api'

  const props = defineProps({
    dateObj: {
      type: Object,
      default: () => ({}),
    },
  })

  const query = reactive({
    startDate: '',
    endDate: '',
  })

  const payData = ref<TradeReportResult>({})
  const refundData = ref<TradeReportResult>({})
  const withdrawData = ref<TradeReportResult>({})
  const mchData = ref<MerchantReportResult>({})

  //监听查询标识 重新查询
  watch(
    () => props.dateObj.sign,
    () => {
      initData() //调用数据
    },
    {
      deep: true,
      immediate: true,
    },
  )

  /**
   * 初始化数据
   */
  function initData() {
    query.startDate = props.dateObj.startDate
    query.endDate = props.dateObj.endDate
    // 支付订单
    payTradeReport(query).then(({ data }) => {
      payData.value = data
    })
    // 退款订单
    rfdTradeReport(query).then(({ data }) => {
      refundData.value = data
    })
    // 商户信息
    merchantCountReport(query).then(({ data }) => {
      mchData.value = data
    })
    // 提现记录
    withdrawTradeReport(query).then(({ data }) => {
      withdrawData.value = data
    }).catch(() => {
      // 如果接口不存在，保持空数据
    })
  }
</script>

<style lang="scss" scoped>
  .grow-card-wrapper {
    width: 100%;
  }

  // 统计卡片
  .stat-card {
    position: relative;
    display: flex;
    align-items: center;
    padding: 20px 16px;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    overflow: hidden;
    height: 100px;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    }

    &__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 52px;
      height: 52px;
      border-radius: 10px;
      margin-right: 14px;
      flex-shrink: 0;
    }

    &__content {
      flex: 1;
      min-width: 0;
    }

    &__title {
      font-size: 13px;
      color: #86909c;
      margin-bottom: 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &__value {
      font-size: 22px;
      font-weight: 600;
      color: #1d2129;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &__prefix {
      font-size: 16px;
      margin-right: 2px;
    }

    // 蓝色主题
    &--blue {
      &::before {
        background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
      }
      .stat-card__icon {
        background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
        color: #2563eb;
      }
    }

    // 紫色主题
    &--purple {
      &::before {
        background: linear-gradient(180deg, #a855f7 0%, #9333ea 100%);
      }
      .stat-card__icon {
        background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
        color: #9333ea;
      }
    }

    // 红色主题
    &--red {
      &::before {
        background: linear-gradient(180deg, #ef4444 0%, #dc2626 100%);
      }
      .stat-card__icon {
        background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
        color: #dc2626;
      }
    }

    // 粉色主题
    &--pink {
      &::before {
        background: linear-gradient(180deg, #ec4899 0%, #db2777 100%);
      }
      .stat-card__icon {
        background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
        color: #db2777;
      }
    }

    // 蓝绿色主题
    &--teal {
      &::before {
        background: linear-gradient(180deg, #14b8a6 0%, #0d9488 100%);
      }
      .stat-card__icon {
        background: linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%);
        color: #0d9488;
      }
    }

    // 琥珀色主题
    &--amber {
      &::before {
        background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
      }
      .stat-card__icon {
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        color: #d97706;
      }
    }

    // 青色主题
    &--cyan {
      &::before {
        background: linear-gradient(180deg, #06b6d4 0%, #0891b2 100%);
      }
      .stat-card__icon {
        background: linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%);
        color: #0891b2;
      }
    }

    // 橙色主题
    &--orange {
      &::before {
        background: linear-gradient(180deg, #f97316 0%, #ea580c 100%);
      }
      .stat-card__icon {
        background: linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%);
        color: #ea580c;
      }
    }
  }

  // 通知公告卡片
  .notice-card {
    padding: 20px;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    height: calc((100px + 16px) * 4 - 16px);
    display: flex;
    flex-direction: column;

    &__header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      color: #1d2129;
      font-size: 16px;
      font-weight: 600;
    }

    &__title {
      margin-left: 4px;
    }

    &__content {
      flex: 1;
      overflow-y: auto;
    }
  }

  .notice-item {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f2f3f5;

    &:last-child {
      border-bottom: none;
    }

    &__dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      margin-right: 12px;
      flex-shrink: 0;
    }

    &__text {
      flex: 1;
      font-size: 14px;
      color: #4e5969;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &:hover {
        color: #3b82f6;
        cursor: pointer;
      }
    }

    &__date {
      font-size: 12px;
      color: #86909c;
      margin-left: 16px;
      flex-shrink: 0;
    }
  }

  // 响应式设计
  @media (max-width: 1200px) {
    .stat-card {
      padding: 16px 14px;
      height: 90px;

      &__icon {
        width: 46px;
        height: 46px;
        margin-right: 12px;
      }

      &__title {
        font-size: 12px;
      }

      &__value {
        font-size: 20px;
      }

      &__prefix {
        font-size: 14px;
      }
    }

    .notice-card {
      padding: 16px;
      height: calc((90px + 16px) * 4 - 16px);

      &__header {
        font-size: 14px;
      }
    }

    .notice-item {
      &__text {
        font-size: 13px;
      }

      &__date {
        font-size: 11px;
      }
    }
  }

  @media (max-width: 768px) {
    .stat-card {
      padding: 14px 12px;
      height: 80px;

      &__icon {
        width: 40px;
        height: 40px;
        margin-right: 10px;

        svg {
          width: 22px;
          height: 22px;
        }
      }

      &__title {
        font-size: 11px;
      }

      &__value {
        font-size: 18px;
      }

      &__prefix {
        font-size: 13px;
      }
    }

    .notice-card {
      padding: 14px;
      height: auto;
      min-height: 300px;

      &__header {
        font-size: 14px;
      }
    }

    .notice-item {
      padding: 10px 0;

      &__text {
        font-size: 12px;
      }

      &__date {
        font-size: 11px;
      }
    }
  }
</style>
