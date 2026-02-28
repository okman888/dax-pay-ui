<template>
  <alipay-isv-config-edit v-if="record.channel === ChannelEnum.ALI_ISV" ref="alipayIsv" @ok="ok" />
  <wechat-isv-config-edit
    v-if="record.channel === ChannelEnum.WECHAT_ISV"
    ref="wechatIsv"
    @ok="ok"
  />
  <leshua-isv-config-edit
    v-if="record.channel === ChannelEnum.LESHUA_PAY"
    ref="leshuaIsv"
    @ok="ok"
  />
  <vbill-isv-config-edit v-if="record.channel === ChannelEnum.VBILL_PAY" ref="vbillIsv" @ok="ok" />
  <hkrt-isv-config-edit v-if="record.channel === ChannelEnum.HKRT_PAY" ref="hkrtIsv" @ok="ok" />
  <lakala-isv-config-edit
    v-if="record.channel === ChannelEnum.LAKALA_PAY"
    ref="lakalaIsv"
    @ok="ok"
  />
  <fuyou-isv-config-edit v-if="record.channel === ChannelEnum.FUYOU_PAY" ref="fuyouIsv" @ok="ok" />
  <sand-isv-config-edit v-if="record.channel === ChannelEnum.SAND_PAY" ref="sandIsv" @ok="ok" />
  <yee-pay-isv-config-edit v-if="record.channel === ChannelEnum.YEE_PAY" ref="yeePayIsv" @ok="ok" />
  <dougong-isv-config-edit
    v-if="record.channel === ChannelEnum.DOUGONG_PAY"
    ref="dougongIsv"
    @ok="ok"
  />
  <cpcn-pay-isv-config-edit
    v-if="record.channel === ChannelEnum.CPCN_PAY"
    ref="cpcnPayIsv"
    @ok="ok"
  />
</template>
<script setup lang="ts">
  import { nextTick, ref } from 'vue'
  import { useMessage } from '@/hooks/web/useMessage'
  import { ChannelEnum } from '@/enums/daxpay/daxpayEnum'
  import { IsvChannelConfig } from './IsvChannelConfig.api'
  import AlipayIsvConfigEdit from '@/views/daxpay/common/channel/alipay/config/isv/AlipayIsvConfigEdit.vue'
  import WechatIsvConfigEdit from '@/views/daxpay/common/channel/wechat/config/isv/WechatIsvConfigEdit.vue'
  import LeshuaIsvConfigEdit from '@/views/daxpay/common/channel/leshua/config/isv/LeshuaIsvConfigEdit.vue'
  import VbillIsvConfigEdit from '@/views/daxpay/common/channel/vbill/config/isv/VbillIsvConfigEdit.vue'
  import HkrtIsvConfigEdit from '@/views/daxpay/common/channel/hkrt/config/isv/HkrtIsvConfigEdit.vue'
  import LakalaIsvConfigEdit from '@/views/daxpay/common/channel/lakala/config/isv/LakalaIsvConfigEdit.vue'
  import FuyouIsvConfigEdit from '@/views/daxpay/common/channel/fuyou/config/isv/FuyouIsvConfigEdit.vue'
  import SandIsvConfigEdit from '@/views/daxpay/common/channel/sand/config/isv/SandIsvConfigEdit.vue'
  import YeePayIsvConfigEdit from '@/views/daxpay/common/channel/yeepay/config/isv/YeePayIsvConfigEdit.vue'
  import DougongIsvConfigEdit from '@/views/daxpay/common/channel/dougong/config/isv/DougongIsvConfigEdit.vue'
  import CpcnPayIsvConfigEdit from '@/views/daxpay/common/channel/cpcnpay/config/isv/CpcnIsvConfigEdit.vue'

  const { createMessage } = useMessage()

  let record = ref<IsvChannelConfig>({})
  const alipayIsv = ref<any>()
  const wechatIsv = ref<any>()
  const leshuaIsv = ref<any>()
  const vbillIsv = ref<any>()
  const hkrtIsv = ref<any>()
  const lakalaIsv = ref<any>()
  const fuyouIsv = ref<any>()
  const sandIsv = ref<any>()
  const yeePayIsv = ref<any>()
  const dougongIsv = ref<any>()
  const cpcnPayIsv = ref<any>()

  // 事件
  const emits = defineEmits(['ok'])
  /**
   * 打开
   */
  function show(isvChannelConfig: IsvChannelConfig) {
    record.value = isvChannelConfig
    nextTick(() => {
      switch (record.value.channel) {
        case ChannelEnum.ALI_ISV: {
          alipayIsv.value.init(record.value)
          break
        }
        case ChannelEnum.WECHAT_ISV: {
          wechatIsv.value.init(record.value)
          break
        }
        case ChannelEnum.LESHUA_PAY: {
          leshuaIsv.value.init(record.value)
          break
        }
        case ChannelEnum.VBILL_PAY: {
          vbillIsv.value.init(record.value)
          break
        }
        case ChannelEnum.HKRT_PAY: {
          hkrtIsv.value.init(record.value)
          break
        }
        case ChannelEnum.LAKALA_PAY: {
          lakalaIsv.value.init(record.value)
          break
        }
        case ChannelEnum.FUYOU_PAY: {
          fuyouIsv.value.init(record.value)
          break
        }
        case ChannelEnum.SAND_PAY: {
          sandIsv.value.init(record.value)
          break
        }
        case ChannelEnum.YEE_PAY: {
          yeePayIsv.value.init(record.value)
          break
        }
        case ChannelEnum.DOUGONG_PAY: {
          dougongIsv.value.init(record.value)
          break
        }
        case ChannelEnum.CPCN_PAY: {
          cpcnPayIsv.value.init(record.value)
          break
        }
        default: {
          createMessage.info('暂未支持, 请期待...')
        }
      }
    })
  }

  /**
   * 操作完成回调
   */
  function ok() {
    emits('ok')
  }

  defineExpose({ show })
</script>

<style scoped lang="less"></style>
