import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { MchEntity } from '#/web'

/**
 * 获取单条特约商户
 */
export function getConfig(appId) {
  return defHttp.get<Result<VbillSubConfig>>({
    url: '/vbill/config/findByAppId',
    params: { appId },
  })
}

/**
 * 保存或更新特约商户
 */
export function update(obj: VbillSubConfig) {
  return defHttp.post({
    url: '/vbill/config/update',
    data: obj,
  })
}

/**
 * 子商户服务商配置
 */
export interface VbillSubConfig extends MchEntity {
  // 服务商号
  isvNo?: string
  // 随行付商户号
  mno?: string
  // 是否启用
  enable: boolean
  // 读取服务商配置
  readSystem?: boolean
  // 微信AppId
  wxAppId?: string
  // 微信AppSecret
  wxAppSecret?: string
  // 微信授权认证地址
  wxAuthUrl?: string
}
