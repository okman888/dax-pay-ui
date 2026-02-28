import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { MchEntity } from '#/web'

/**
 * 获取单条特约商户
 */
export function getConfig(appId) {
  return defHttp.get<Result<SandSubConfig>>({
    url: '/cpcnpay/config/findSubByAppId',
    params: { appId },
  })
}

/**
 * 保存或更新特约商户
 */
export function update(obj: SandSubConfig) {
  return defHttp.post({
    url: '/cpcnpay/config/update',
    data: obj,
  })
}

/**
 * 子商户服务商配置
 */
export interface SandSubConfig extends MchEntity {
  // 机构号
  institutionId?: string
  // 商户编号
  merchantNo?: string
  // 门店号
  storeId?: string
  // 是否启用
  enable: boolean
  // 读取服务商配置
  readSystem?: boolean
  // 微信使用通道渠道认证
  wxChannelAuth?: boolean
  // 微信AppId
  wxAppId?: string
  // 微信AppSecret
  wxAppSecret?: string
  // 微信授权认证地址
  wxAuthUrl?: string
}
