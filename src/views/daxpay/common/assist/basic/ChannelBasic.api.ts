import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { LabeledValue } from 'ant-design-vue/lib/select'

/**
 * 查询支付通道下属的支付方式列表
 */
export function payMethodList(channel: string) {
  return defHttp.get<Result<LabeledValue[]>>({
    url: '/channel/basic/payMethodList',
    params: { channel },
  })
}
/**
 * 查询支付通道下属指定场景的支付方式列表
 */
export function findMethodByScene(channel, scene) {
  return defHttp.get<Result<LabeledValue[]>>({
    url: '/channel/basic/findMethodByScene',
    params: { channel, scene },
  })
}

/**
 * 查询支付通道下属指定场景的网关支付方式列表
 */
export function findGatewayMethodByScene(channel, scene) {
  return defHttp.get<Result<LabeledValue[]>>({
    url: '/channel/basic//gateway/findMethodByScene',
    params: { channel, scene },
  })
}

