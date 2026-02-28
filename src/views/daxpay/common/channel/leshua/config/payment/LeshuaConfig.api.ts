import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { MchEntity } from '#/web'

/**
 * 获取单条特约商户
 */
export function getConfig(appId) {
  return defHttp.get<Result<LeshuaSubConfig>>({
    url: '/leshua/config/findByAppId',
    params: { appId },
  })
}

/**
 * 保存或更新特约商户
 */
export function update(obj: LeshuaSubConfig) {
  return defHttp.post({
    url: '/leshua/config/update',
    data: obj,
  })
}

/**
 * 乐刷支付子商户配置
 */
export interface LeshuaSubConfig extends MchEntity {
  // 服务商号
  isvNo?: string
  // 乐刷商户号
  lsMchNo?: string
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
