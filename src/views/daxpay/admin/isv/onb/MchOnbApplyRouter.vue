<!-- MchOnbApplyRouter.vue -->
<template>
  <div>
    <!-- 通用编辑组件 -->
    <MchOnbApplyEdit ref="applyFillDrawer" @ok="onOk" />
    <!-- CPCN特定编辑组件 -->
    <CpcnOnbApplyEdit ref="cpcnApplyFillDrawer" @ok="onOk" />
    <!-- 其他渠道的编辑组件可以在这里添加 -->
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import CpcnOnbApplyEdit from './cpcn/CpcnOnbApplyEdit.vue'

  const applyFillDrawer = ref()
  const cpcnApplyFillDrawer = ref()

  const emits = defineEmits(['ok'])

  /**
   * 初始化函数，根据渠道类型打开相应的编辑页面
   * @param id - 申请ID
   * @param mchId - 商户ID
   */
  async function init(id: string, channel: string) {
    try {
      // 根据渠道类型打开相应的编辑页面
      switch (channel) {
        case 'cpcn_pay':
          cpcnApplyFillDrawer.value.init(id, channel)
          break
        default:
          console.log('使用通用编辑页面')
          break
      }
    } catch (error) {
      console.error('获取申请详情失败:', error)
    }
  }

  /**
   * 处理保存成功事件
   */
  function onOk() {
    emits('ok')
  }

  defineExpose({
    init,
  })
</script>
