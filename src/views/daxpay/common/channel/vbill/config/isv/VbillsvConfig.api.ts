import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { MchEntity } from '#/web'

/**
 * 获取单条
 */
export function getConfig(isvNo) {
  return defHttp.get<Result<VbillIsvConfig>>({
    url: '/vbill/config/isv/findByIsvNo',
    params: { isvNo },
  })
}

/**
 * 保存或更新
 */
export function update(obj: VbillIsvConfig) {
  return defHttp.post({
    url: '/vbill/config/isv/update',
    data: obj,
  })
}

/**
 * 随行付服务商配置
 */
export interface VbillIsvConfig extends MchEntity {
  // 天阙机构id
  orgId?: string
  // 是否启用
  enable: boolean
  // 沙箱
  sandbox: boolean
  // 天阙公钥
  publicKey?: string
  // 私钥
  privateKey?: string
  // 微信AppId
  wxAppId?: string
  // 微信AppSecret
  wxAppSecret?: string
  // 微信授权认证地址
  wxAuthUrl?: string
}
