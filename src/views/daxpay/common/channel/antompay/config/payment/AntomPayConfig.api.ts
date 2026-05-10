import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { MchEntity } from '#/web'

/**
 * 获取单条配置
 */
export function getConfig(appId) {
  return defHttp.get<Result<AntomPayConfig>>({
    url: '/antom/config/findByAppId',
    params: { appId },
  })
}

/**
 * 更新配置
 */
export function update(obj: AntomPayConfig) {
  return defHttp.post({
    url: '/antom/config/update',
    data: obj,
  })
}

/**
 * AntomPay配置
 */
export interface AntomPayConfig extends MchEntity {
  // 商户号
  mchNo?: string
  // 商户AppId
  appId?: string
  // 是否启用
  enable: boolean
  // Antom客户端ID
  clientId?: string
  // 商户私钥
  merchantPrivateKey?: string
  // Antom公钥
  antomPublicKey?: string
  // 支付网关地址
  gatewayUrl?: string
  // 是否沙箱环境
  sandbox?: boolean
  // 支付结果通知URL
  notifyUrl?: string
  // 同步跳转URL
  returnUrl?: string
}
