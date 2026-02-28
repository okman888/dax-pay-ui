<template>
  <alipay-config-edit v-if="record.channel === ChannelEnum.ALI" ref="alipay" @ok="ok" />
  <alipay-sub-config-edit v-if="record.channel === ChannelEnum.ALI_ISV" ref="alipaySub" @ok="ok" />
  <wechat-pay-config-edit v-if="record.channel === ChannelEnum.WECHAT" ref="wechat" @ok="ok" />
  <wechatsub-config-edit
    v-if="record.channel === ChannelEnum.WECHAT_ISV"
    ref="wechatSub"
    @ok="ok"
  />
  <union-pay-config-edit v-if="record.channel === ChannelEnum.UNION_PAY" ref="union" @ok="ok" />
  <leshua-sub-config-edit
    v-if="record.channel === ChannelEnum.LESHUA_PAY"
    ref="leshuaSub"
    @ok="ok"
  />
  <vbill-sub-config-edit v-if="record.channel === ChannelEnum.VBILL_PAY" ref="vbillSub" @ok="ok" />
  <adapay-config-edit v-if="record.channel === ChannelEnum.ADA_PAY" ref="adapay" @ok="ok" />
  <hkrt-sub-config-edit v-if="record.channel === ChannelEnum.HKRT_PAY" ref="hkrtSub" @ok="ok" />
  <lakala-sub-config-edit
    v-if="record.channel === ChannelEnum.LAKALA_PAY"
    ref="lakalaSub"
    @ok="ok"
  />
  <fuyou-sub-config-edit v-if="record.channel === ChannelEnum.FUYOU_PAY" ref="fuyouSub" @ok="ok" />
  <sand-sub-config-edit v-if="record.channel === ChannelEnum.SAND_PAY" ref="sandSub" @ok="ok" />
  <yee-pay-sub-config-edit v-if="record.channel === ChannelEnum.YEE_PAY" ref="yeePaySub" @ok="ok" />
  <dougong-sub-config-edit
    v-if="record.channel === ChannelEnum.DOUGONG_PAY"
    ref="dougongSub"
    @ok="ok"
  />
  <ums-pay-config-edit v-if="record.channel === ChannelEnum.UMS_PAY" ref="umsPay" @ok="ok" />
  <cpcn-pay-config-edit v-if="record.channel === ChannelEnum.CPCN_PAY" ref="cpcnPay" @ok="ok" />
</template>
<script setup lang="ts">
  import { nextTick, ref } from 'vue'
  import { useMessage } from '@/hooks/web/useMessage'
  import { ChannelEnum } from '@/enums/daxpay/daxpayEnum'
  import { ChannelConfig } from './ChannelConfig.api'
  import AlipayConfigEdit from '@/views/daxpay/common/channel/alipay/config/payment/AlipayConfigEdit.vue'
  import WechatPayConfigEdit from '@/views/daxpay/common/channel/wechat/config/payment/WechatPayConfigEdit.vue'
  import UnionPayConfigEdit from '@/views/daxpay/common/channel/union/config/UnionPayConfigEdit.vue'
  import AlipaySubConfigEdit from '@/views/daxpay/common/channel/alipay/config/payment/AlipaySubConfigEdit.vue'
  import WechatsubConfigEdit from '@/views/daxpay/common/channel/wechat/config/payment/WechatSubConfigEdit.vue'
  import LeshuaSubConfigEdit from '@/views/daxpay/common/channel/leshua/config/payment/LeshuaSubConfigEdit.vue'
  import VbillSubConfigEdit from '@/views/daxpay/common/channel/vbill/config/payment/VbillSubConfigEdit.vue'
  import AdapayConfigEdit from '@/views/daxpay/common/channel/adapay/config/AdapayConfigEdit.vue'
  import HkrtSubConfigEdit from '@/views/daxpay/common/channel/hkrt/config/payment/HkrtSubConfigEdit.vue'
  import LakalaSubConfigEdit from '@/views/daxpay/common/channel/lakala/config/payment/LakalaSubConfigEdit.vue'
  import FuyouSubConfigEdit from '@/views/daxpay/common/channel/fuyou/config/payment/FuyouSubConfigEdit.vue'
  import SandSubConfigEdit from '@/views/daxpay/common/channel/sand/config/payment/SandSubConfigEdit.vue'
  import YeePaySubConfigEdit from '@/views/daxpay/common/channel/yeepay/config/payment/YeePaySubConfigEdit.vue'
  import DougongSubConfigEdit from '@/views/daxpay/common/channel/dougong/config/payment/DougongSubConfigEdit.vue'
  import UmsPayConfigEdit from '@/views/daxpay/common/channel/ums/config/UmsPayConfigEdit.vue'
  import CpcnPayConfigEdit from '@/views/daxpay/common/channel/cpcnpay/config/payment/CpcnSubConfigEdit.vue'

  const { createMessage } = useMessage()

  let record = ref<ChannelConfig>({})
  const alipay = ref<any>()
  const alipaySub = ref<any>()
  const wechat = ref<any>()
  const wechatSub = ref<any>()
  const union = ref<any>()
  const leshuaSub = ref<any>()
  const vbillSub = ref<any>()
  const adapay = ref<any>()
  const hkrtSub = ref<any>()
  const lakalaSub = ref<any>()
  const fuyouSub = ref<any>()
  const sandSub = ref<any>()
  const yeePaySub = ref<any>()
  const dougongSub = ref<any>()
  const umsPay = ref<any>()
  const cpcnPay = ref<any>()

  // 事件
  const emits = defineEmits(['ok'])
  /**
   * 打开
   */
  function show(channelConfig: ChannelConfig) {
    record.value = channelConfig
    nextTick(() => {
      switch (record.value.channel) {
        case ChannelEnum.ALI_ISV: {
          alipaySub.value.init(record.value)
          break
        }
        case ChannelEnum.WECHAT_ISV: {
          wechatSub.value.init(record.value)
          break
        }
        case ChannelEnum.ALI: {
          alipay.value.init(record.value, false)
          break
        }
        case ChannelEnum.WECHAT: {
          wechat.value.init(record.value, false)
          break
        }
        case ChannelEnum.LESHUA_PAY: {
          leshuaSub.value.init(record.value)
          break
        }
        case ChannelEnum.VBILL_PAY: {
          vbillSub.value.init(record.value)
          break
        }
        case ChannelEnum.HKRT_PAY: {
          hkrtSub.value.init(record.value)
          break
        }
        case ChannelEnum.UNION_PAY: {
          union.value.init(record.value)
          break
        }
        case ChannelEnum.ADA_PAY: {
          adapay.value.init(record.value, true)
          break
        }
        case ChannelEnum.LAKALA_PAY: {
          lakalaSub.value.init(record.value)
          break
        }
        case ChannelEnum.FUYOU_PAY: {
          fuyouSub.value.init(record.value)
          break
        }
        case ChannelEnum.SAND_PAY: {
          sandSub.value.init(record.value)
          break
        }
        case ChannelEnum.YEE_PAY: {
          yeePaySub.value.init(record.value)
          break
        }
        case ChannelEnum.DOUGONG_PAY: {
          dougongSub.value.init(record.value)
          break
        }
        case ChannelEnum.UMS_PAY: {
          umsPay.value.init(record.value)
          break
        }
        case ChannelEnum.CPCN_PAY: {
          cpcnPay.value.init(record.value)
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
