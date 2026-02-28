<template>
  <basic-modal
    destroyOnClose
    :footer="null"
    v-bind="$attrs"
    width="75%"
    title="网关支付配置"
    :mask-closable="false"
    :open="visible"
    @cancel="handleCancel"
  >
    <a-tabs v-model:activeKey="activeKey" tabPosition="left" style="min-height: 550px">
      <a-tab-pane :key="0" tab="公共配置">
        <gateway-pay-read-config-form :appId="currentAppId" @init="initGatewayReadConfig" />
      </a-tab-pane>
      <a-tab-pane :key="1" v-if="!config?.gatewayReadSystem" tab="网关支付配置">
        <gateway-pay-config-form :appId="currentAppId" />
      </a-tab-pane>
      <a-tab-pane :key="4" tab="收银码牌配置">
        <cashier-code-config-form :appId="currentAppId" />
      </a-tab-pane>
      <a-tab-pane :key="2" v-if="!config?.aggregateQrReadSystem" tab="聚合二维码支付配置">
        <aggregate-qr-config-form :appId="currentAppId" />
      </a-tab-pane>
      <a-tab-pane :key="3" tab="聚合付款码支付配置" v-if="!config?.aggregateBarReadSystem">
        <aggregate-bar-config-form :appId="currentAppId" />
      </a-tab-pane>
      <a-tab-pane :key="5" tab="PC收银台配置" v-if="!config?.pcReadSystem">
        <checkout-counter-config-list :appId="currentAppId" type="pc" />
      </a-tab-pane>
      <a-tab-pane :key="6" tab="H5收银台配置" v-if="!config?.h5ReadSystem">
        <checkout-counter-config-list :appId="currentAppId" type="h5" />
      </a-tab-pane>
      <a-tab-pane :key="7" tab="小程序快捷支付配置">
        <mini-quickly-config-form
          :appId="currentAppId"
          :miniQuicklyReadSystem="config?.miniQuicklyReadSystem"
        />
      </a-tab-pane>
    </a-tabs>
  </basic-modal>
</template>
<script setup lang="ts">
  import { ref } from 'vue'
  import GatewayPayConfigForm from './common/GatewayPayConfigForm.vue'
  import AggregateQrConfigForm from './aggregate/AggregateQrConfigForm.vue'
  import AggregateBarConfigForm from './aggregate/AggregateBarConfigForm.vue'
  import CashierCodeConfigForm from './cashier/CashierCodeConfigForm.vue'
  import CheckoutCounterConfigList from './checkout/CheckoutCounterConfigList.vue'
  import { BasicModal } from '@/components/Modal'
  import { MchApp } from '@/views/daxpay/admin/merchant/app/MchAppAdmin.api'
  import { GatewayPayReadConfig } from './common/GatewayPayConfig.api'
  import GatewayPayReadConfigForm from './common/GatewayPayReadConfigForm.vue'
  import MiniQuicklyConfigForm from './quickly/MiniQuicklyConfigForm.vue'

  const visible = ref(false)
  const activeKey = ref(0)
  const currentApp = ref<MchApp>({})
  const currentAppId = ref<string>('')
  const config = ref<GatewayPayReadConfig>()

  /**
   * 入口
   */
  function init(mchApp: MchApp) {
    visible.value = true
    activeKey.value = 0
    currentApp.value = mchApp
    currentAppId.value = mchApp.appId as string
  }

  /**
   * 加载网关配置
   */
  function initGatewayReadConfig(data: GatewayPayReadConfig) {
    config.value = data
  }

  /**
   * 关闭页面
   */
  function handleCancel() {
    visible.value = false
  }

  defineExpose({ init })
</script>

<style scoped lang="less"></style>
