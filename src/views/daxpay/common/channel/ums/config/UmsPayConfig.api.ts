import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { MchEntity } from '#/web'

/**
 * 获取单条
 */
export function getConfig(appId) {
  return defHttp.get<Result<UmsPayConfig>>({
    url: '/ums/config/findByAppId',
    params: { appId },
  })
}

/**
 * 保存或更新
 */
export function update(obj: UmsPayConfig) {
  return defHttp.post({
    url: '/ums/config/update',
    data: obj,
  })
}

/**
 * 银联商务配置
 */
export interface UmsPayConfig extends MchEntity {
  // 应用ID
  umsAppId?: string
  // 应用密钥
  appKey?: string
  // 商户号
  merchantNo?: string
  // 终端号
  terminalNo?: string
  // 订单号前缀
  orderPrefix?: string
  // 密钥
  secretKey?: string
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
