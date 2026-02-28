<template>
  <div class="grow-card-wrapper">
    <a-row :gutter="[16, 16]">
      <!-- 支付订单卡片 -->
      <a-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card stat-card--blue">
          <div class="stat-card__icon">
            <Icon icon="shopping-cart-outlined" :size="32" />
          </div>
          <div class="stat-card__content">
            <div class="stat-card__title">支付订单数</div>
            <div class="stat-card__value">
              <CountTo :startVal="0" :endVal="payData.tradeCount || 0" />
            </div>
          </div>
        </div>
      </a-col>

      <!-- 订单金额卡片 -->
      <a-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card stat-card--purple">
          <div class="stat-card__icon">
            <Icon icon="money-collect-outlined" :size="32" />
          </div>
          <div class="stat-card__content">
            <div class="stat-card__title">订单金额</div>
            <div class="stat-card__value">
              ¥ <CountTo :startVal="0" :endVal="payData.tradeAmount || 0" :precision="2" />
            </div>
          </div>
        </div>
      </a-col>

      <!-- 应到账金额卡片 -->
      <a-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card stat-card--green">
          <div class="stat-card__icon">
            <Icon icon="wallet-outlined" :size="32" />
          </div>
          <div class="stat-card__content">
            <div class="stat-card__title">应到账金额</div>
            <div class="stat-card__value">
              ¥ <CountTo :startVal="0" :endVal="payData.receivableAmount || 0" :precision="2" />
            </div>
          </div>
        </div>
      </a-col>

      <!-- 最大单笔金额卡片 -->
      <a-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card stat-card--orange">
          <div class="stat-card__icon">
            <Icon icon="rise-outlined" :size="32" />
          </div>
          <div class="stat-card__content">
            <div class="stat-card__title">最大单笔金额</div>
            <div class="stat-card__value">
              ¥ <CountTo :startVal="0" :endVal="payData.maxAmount || 0" :precision="2" />
            </div>
          </div>
        </div>
      </a-col>

      <!-- 提现笔数卡片 -->
      <a-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card stat-card--cyan">
          <div class="stat-card__icon">
            <Icon icon="transaction-outlined" :size="32" />
          </div>
          <div class="stat-card__content">
            <div class="stat-card__title">提现笔数</div>
            <div class="stat-card__value">
              <CountTo :startVal="0" :endVal="withdrawData.tradeCount || 0" />
            </div>
          </div>
        </div>
      </a-col>

      <!-- 提现金额卡片 -->
      <a-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card stat-card--pink">
          <div class="stat-card__icon">
            <Icon icon="minus-circle-outlined" :size="32" />
          </div>
          <div class="stat-card__content">
            <div class="stat-card__title">提现金额</div>
            <div class="stat-card__value">
              ¥ <CountTo :startVal="0" :endVal="withdrawData.tradeAmount || 0" :precision="2" />
            </div>
          </div>
        </div>
      </a-col>

      <!-- 退款订单数卡片 -->
      <a-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card stat-card--red">
          <div class="stat-card__icon">
            <Icon icon="rollback-outlined" :size="32" />
          </div>
          <div class="stat-card__content">
            <div class="stat-card__title">退款订单数</div>
            <div class="stat-card__value">
              <CountTo :startVal="0" :endVal="refundData.tradeCount || 0" />
            </div>
          </div>
        </div>
      </a-col>

      <!-- 退款金额卡片 -->
      <a-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card stat-card--indigo">
          <div class="stat-card__icon">
            <Icon icon="retweet-outlined" :size="32" />
          </div>
          <div class="stat-card__content">
            <div class="stat-card__title">退款金额</div>
            <div class="stat-card__value">
              ¥ <CountTo :startVal="0" :endVal="refundData.tradeAmount || 0" :precision="2" />
            </div>
          </div>
        </div>
      </a-col>
    </a-row>

    <!-- 通知公告区域 -->
    <a-row :gutter="[16, 16]" style="margin-top: 16px">
      <a-col :span="24">
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
  import { MerchantStatusEnum } from '@/enums/daxpay/daxpayEnum'
  import { payTradeReport, rfdTradeReport, withdrawTradeReport, TradeReportResult, getShopInfo } from '../IndexRepot.api'

  const props = defineProps({
    dateObj: {
      type: Object,
      default: () => {},
    },
  })

  const query = reactive({
    startDate: '',
    endDate: '',
  })

  const payData = ref<TradeReportResult>({})
  const refundData = ref<TradeReportResult>({})
  const withdrawData = ref<TradeReportResult>({})
  const infoData = ref<any>({})

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
    // 提现记录
    withdrawTradeReport(query).then(({ data }) => {
      withdrawData.value = data
    })
    getShopInfo().then(({ data }) => {
      infoData.value = data
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
    padding: 20px;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
    }

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    &__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      border-radius: 12px;
      margin-right: 16px;
    }

    &__content {
      flex: 1;
    }

    &__title {
      font-size: 14px;
      color: #86909c;
      margin-bottom: 8px;
    }

    &__value {
      font-size: 24px;
      font-weight: 600;
      color: #1d2129;
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

    // 绿色主题
    &--green {
      &::before {
        background: linear-gradient(180deg, #22c55e 0%, #16a34a 100%);
      }
      .stat-card__icon {
        background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
        color: #16a34a;
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

    // 靛青主题
    &--indigo {
      &::before {
        background: linear-gradient(180deg, #6366f1 0%, #4f46e5 100%);
      }
      .stat-card__icon {
        background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
        color: #4f46e5;
      }
    }
  }

  // 通知公告卡片
  .notice-card {
    padding: 20px;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

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
      max-height: 200px;
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
      .common_title {
        padding-left: 14px;
        font-size: 16px;

        &::before {
          width: 3px;
          height: 15px;
          border-radius: 0 8px 8px 0;
        }
      }

      .orderTop {
        height: 120px;
        padding: 20px 16px;
        border-radius: 8px;

        .logoBox img {
          height: 56px;
        }

        .boxTitle {
          margin-left: 18px;

          .title {
            font-size: 20px;
          }

          .info {
            width: 420px;

            .info_item {
              margin-top: 8px;
              font-size: 14px;
            }
          }
        }
      }

      .orderLeft {
        height: 480px;
        border-radius: 8px;

        .left_item {
          padding: 16px 0;
          border-radius: 8px;
          gap: 12px;

          .content_box {
            padding: 0 14px;
            gap: 14px;

            .content_item {
              padding: 10px 12px;
              border-radius: 8px;

              .left {
                gap: 12px;

                .title {
                  font-size: 18px;
                }

                .number {
                  font-size: 30px;
                }
              }

              .right img {
                width: 45px;
                height: 45px;
              }
            }
          }
        }
      }

      .orderRight {
        height: 480px;
        padding: 22px 0 8px;
        border-radius: 8px;
        gap: 11px;

        .adverse_content {
          height: calc(100% - 40px);
          padding: 0 16px;

          .adverse_item {
            margin-bottom: 5px;
            font-size: 12px;
            gap: 16px;

            .date {
              width: 65px;
            }
          }
        }
      }
    }

    @media (max-width: 1200px) {
    .stat-card {
      padding: 16px;

      &__icon {
        width: 48px;
        height: 48px;
        margin-right: 12px;
      }

      &__title {
        font-size: 13px;
      }

      &__value {
        font-size: 20px;
      }
    }
  }

  @media (max-width: 768px) {
    .stat-card {
      padding: 14px;

      &__icon {
        width: 44px;
        height: 44px;
        margin-right: 10px;

        svg {
          width: 24px;
          height: 24px;
        }
      }

      &__title {
        font-size: 12px;
      }

      &__value {
        font-size: 18px;
      }
    }

    .notice-card {
      padding: 16px;

      &__header {
        font-size: 14px;
      }
    }

    .notice-item {
      padding: 10px 0;

      &__text {
        font-size: 13px;
      }

      &__date {
        font-size: 11px;
      }
    }
  }
</style>
