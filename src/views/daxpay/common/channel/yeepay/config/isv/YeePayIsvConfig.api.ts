import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'

/**
 * 获取单条
 */
export function getConfig(isvNo) {
  return defHttp.get<Result<YeePayIsvConfig>>({
    url: '/yeepay/config/isv/findByIsvNo',
    params: { isvNo },
  })
}

/**
 * 保存或更新
 */
export function update(obj: YeePayIsvConfig) {
  return defHttp.post({
    url: '/yeepay/config/isv/update',
    data: obj,
  })
}

/**
 * 易宝支付服务商配置
 * @author xxm
 * @since 2025/1/9
 */
export interface YeePayIsvConfig {
  /** 主键 */
  id?: number
  /** 是否启用 */
  enable?: boolean
  /** 沙箱模式 */
  sandbox?: boolean
  /** 服务商号 */
  yopIsvNo?: string
  /** 应用ID */
  appKey?: string
  /** 私钥 */
  privateKey?: string
  /** 易宝公钥 */
  yopPublicKey?: string
  /** 应用密钥 */
  appSecret?: string
  /** 服务商编号 */
  isvNo?: string
  /** 微信AppId */
  wxAppId?: string
  /** 微信AppSecret */
  wxAppSecret?: string
  /** 微信授权链接 */
  wxAuthUrl?: string
}
