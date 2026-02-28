import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { MchEntity } from '#/web'

/**
 * 获取单条特约商户
 */
export function getConfig(appId) {
  return defHttp.get<Result<YeePaySubConfig>>({
    url: '/yeepay/config/sub/findByAppId',
    params: { appId },
  })
}

/**
 * 保存或更新特约商户
 */
export function update(obj: YeePaySubConfig) {
  return defHttp.post({
    url: '/yeepay/config/sub/update',
    data: obj,
  })
}

/**
 * 易宝支付子商户配置
 */
export interface YeePaySubConfig extends MchEntity {
  // 易宝商户号
  merchantNo?: string
  // 是否启用
  enable?: boolean
  // 读取服务商配置
  readSystem?: boolean
  // 微信AppId
  wxAppId?: string
  // 微信AppSecret
  wxAppSecret?: string
  // 微信授权认证地址
  wxAuthUrl?: string
}
