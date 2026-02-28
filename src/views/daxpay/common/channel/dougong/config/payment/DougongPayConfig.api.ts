import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { MchEntity } from '#/web'

/**
 * 获取单条特约商户
 */
export function getConfig(appId) {
  return defHttp.get<Result<DougongSubConfig>>({
    url: '/dougong/config/findByAppId',
    params: { appId },
  })
}

/**
 * 保存或更新特约商户
 */
export function update(obj) {
  return defHttp.post({
    url: '/dougong/config/update',
    data: obj,
  })
}

/**
 * 斗拱子商户配置
 */
export interface DougongSubConfig extends MchEntity {
  // 支付通道商户号
  merchantNo?: string
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
