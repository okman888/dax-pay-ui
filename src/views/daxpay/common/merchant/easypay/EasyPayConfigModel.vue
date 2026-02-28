<template>
  <basic-modal
    destroyOnClose
    defaultFullscreen
    :footer="null"
    title="易支付兼容协议配置"
    :mask-closable="false"
    :open="visible"
    @cancel="handleCancel"
  >
    <a-spin :spinning="loading">
      <a-tabs v-model:activeKey="activeKey" tabPosition="left" style="min-height: 550px">
        <a-tab-pane :key="0" tab="协议配置">
          <easy-pay-credential-form :credential="credential" />
        </a-tab-pane>
        <a-tab-pane :key="1" tab="支付配置">
          <easy-pay-config-form :pid="currentPid" />
        </a-tab-pane>
      </a-tabs>
    </a-spin>
  </basic-modal>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { BasicModal } from '@/components/Modal'
  import EasyPayCredentialForm from './EasyPayCredentialForm.vue'
  import EasyPayConfigForm from './EasyPayConfigForm.vue'
  import { EasyPayCredential, findByMchNo } from './EasyPayCredential.api'

  const visible = ref(false)
  const loading = ref(false)
  const activeKey = ref(0)
  const currentMchNo = ref<string>('')
  const currentPid = ref<number | undefined>(undefined)
  const credential = ref<EasyPayCredential>({})

  /**
   * 入口
   */
  function init(mchNo: string) {
    visible.value = true
    loading.value = true
    activeKey.value = 0
    currentMchNo.value = mchNo
    currentPid.value = undefined
    credential.value = {}

    // 查询易支付凭证配置
    findByMchNo(mchNo)
      .then(({ data }) => {
        credential.value = data
        currentPid.value = data.pid
        loading.value = false
      })
      .catch(() => {
        loading.value = false
      })
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
