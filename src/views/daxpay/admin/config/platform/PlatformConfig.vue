<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <a-tabs v-model:activeKey="activeKey" tabPosition="left" style="min-height: 550px">
        <a-tab-pane key="2" tab="地址配置">
          <platform-url-config />
        </a-tab-pane>
        <a-tab-pane key="3" tab="站点配置">
          <platform-website-config />
        </a-tab-pane>
        <a-tab-pane key="1" tab="支付配置">
          <platform-basic-config />
        </a-tab-pane>
        <a-tab-pane key="5" tab="对接配置">
          <platform-integration-config />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import PlatformUrlConfig from './PlatformUrlConfig.vue'
  import PlatformBasicConfig from './PlatformBasicConfig.vue'
  import PlatformWebsiteConfig from './PlatformWebsiteConfig.vue'
  import PlatformIntegrationConfig from './PlatformIntegrationConfig.vue'

  const activeKey = ref('2')
</script>

<style scoped lang="less"></style>
