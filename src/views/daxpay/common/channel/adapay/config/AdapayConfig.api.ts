import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { MchEntity } from '#/web'

/**
 * 获取单条
 */
export function getConfig(appId) {
  return defHttp.get<Result<AdaPayConfig>>({
    url: '/adapay/config/findByAppId',
    params: { appId },
  })
}

/**
 * 保存或更新
 */
export function update(obj: AdaPayConfig) {
  return defHttp.post({
    url: '/adapay/config/update',
    data: obj,
  })
}

/**
 * 汇付支付配置
 */
export interface AdaPayConfig extends MchEntity {
  // 汇付商户号
  adaPayMchNo?: string
  // 汇付应用号
  adaPayAppId?: string
  // API_KEY
  apiKey?: string
  // 商户RSA私钥
  mchPrivateKey?: string
  // 汇付RSA公钥
  adaPayPublicKey?: string
  // 是否启用
  enable: boolean
  // 是否沙箱环境
  sandbox?: boolean
  // 微信AppId
  wxAppId?: string
  // 微信AppSecret
  wxAppSecret?: string
  // 微信授权认证地址
  wxAuthUrl?: string
}
