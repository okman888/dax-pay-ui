import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { MchEntity } from '#/web'

/**
 * 获取单条特约商户
 */
export function getConfig(appId) {
  return defHttp.get<Result<HkrtSubConfig>>({
    url: '/hkrt/config/findByAppId',
    params: { appId },
  })
}

/**
 * 保存或更新特约商户
 */
export function update(obj: HkrtSubConfig) {
  return defHttp.post({
    url: '/hkrt/config/update',
    data: obj,
  })
}

/**
 * 子商户服务商配置
 */
export interface HkrtSubConfig extends MchEntity {
  // 商户编号
  merchNo?: string
  // SAAS终端号
  pn?: string
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
