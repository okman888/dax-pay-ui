<template>
  <basic-modal
    destroyOnClose
    :footer="null"
    v-bind="$attrs"
    width="75%"
    title="服务商网关支付配置"
    :mask-closable="false"
    :open="visible"
    @cancel="handleCancel"
  >
    <a-tabs v-model:activeKey="activeKey" tabPosition="left" style="min-height: 550px">
      <a-tab-pane :key="1" tab="网关支付配置">
        <Gateway-config-edit :isvNo="currentIsvNo" />
      </a-tab-pane>
      <a-tab-pane :key="2" tab="PC收银配置">
        <Checkout-counter-config-list :isvNo="currentIsvNo" type="pc" />
      </a-tab-pane>
      <a-tab-pane :key="3" tab="H5收银配置">
        <Checkout-counter-config-list :isvNo="currentIsvNo" type="h5" />
      </a-tab-pane>
      <a-tab-pane :key="4" tab="聚合二维码支付配置">
        <Aggregate-qr-config-form :isvNo="currentIsvNo" />
      </a-tab-pane>
      <a-tab-pane :key="5" tab="聚合付款码支付配置">
        <Aggregate-bar-config-form :isvNo="currentIsvNo" />
      </a-tab-pane>
      <a-tab-pane :key="6" tab="小程序快捷支付配置">
        <Mini-quickly-config-form :isvNo="currentIsvNo" />
      </a-tab-pane>
    </a-tabs>
  </basic-modal>
</template>
<script setup lang="ts">
  import { ref } from 'vue'
  import CheckoutCounterConfigList from './checkout/CheckoutCounterConfigList.vue'
  import AggregateQrConfigForm from './aggregate/AggregateQrConfigForm.vue'
  import AggregateBarConfigForm from './aggregate/AggregateBarConfigForm.vue'
  import MiniQuicklyConfigForm from './quickly/MiniQuicklyConfigForm.vue'
  import { BasicModal } from '@/components/Modal'
  import GatewayConfigEdit from './common/GatewayConfigEdit.vue'

  const visible = ref(false)
  const activeKey = ref(1)
  const currentIsvNo = ref('')

  /**
   * 入口
   */
  function init(isvNo: string) {
    visible.value = true
    activeKey.value = 1
    currentIsvNo.value = isvNo
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
