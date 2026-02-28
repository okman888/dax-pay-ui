<template>
  <Card
    :tab-list="tabListTitle"
    v-bind="$attrs"
    :active-tab-key="activeKey"
    @tab-change="onTabChange"
  >
    <p v-if="activeKey === 'tab1'">
      <VisitAnalysis />
    </p>
    <p v-if="activeKey === 'tab2'">
      <VisitAnalysis />
    </p>
    <p v-if="activeKey === 'tab3'">
      <VisitAnalysis />
    </p>
  </Card>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  import { Card } from 'ant-design-vue'
  import VisitAnalysis from './VisitAnalysis.vue'

  const activeKey = ref('tab1')

  const tabListTitle = [
    {
      key: 'tab1',
      tab: '支付通道',
    },
    {
      key: 'tab2',
      tab: '退款通道',
    },
    {
      key: 'tab3',
      tab: '支付方式',
    },
  ]

  function onTabChange(key) {
    activeKey.value = key
  }
</script>
<style lang="scss" scoped>
  // 响应式设计
  @media (max-width: 1200px) {
    :deep(.ant-card) {
      .ant-card-head {
        padding: 0 20px;
        min-height: 50px;
      }
      .ant-card-head-title {
        font-size: 16px;
      }
      .ant-tabs-tab {
        font-size: 14px;
      }
      .ant-card-body {
        padding: 20px;
      }
    }
  }
  
  @media (max-width: 768px) {
    :deep(.ant-card) {
      .ant-card-head {
        padding: 0 16px;
        min-height: 45px;
      }
      .ant-card-head-title {
        font-size: 14px;
      }
      .ant-tabs-tab {
        font-size: 12px;
      }
      .ant-card-body {
        padding: 16px;
      }
    }
  }
  
  @media (max-width: 480px) {
    :deep(.ant-card) {
      .ant-card-head {
        padding: 0 12px;
        min-height: 40px;
      }
      .ant-card-head-title {
        font-size: 12px;
      }
      .ant-tabs-tab {
        font-size: 11px;
      }
      .ant-card-body {
        padding: 12px;
      }
    }
  }
</style>
