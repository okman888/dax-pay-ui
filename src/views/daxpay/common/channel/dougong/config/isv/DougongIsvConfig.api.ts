import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'

/**
 * 获取单条
 */
export function getConfig(isvNo) {
  return defHttp.get<Result<DougongIsvConfig>>({
    url: '/dougong/config/isv/findByIsvNo',
    params: { isvNo },
  })
}

/**
 * 保存或更新
 */
export function update(obj: DougongIsvConfig) {
  return defHttp.post({
    url: '/dougong/config/isv/update',
    data: obj,
  })
}

/**
 * 斗拱支付服务商配置
 * @author xxm
 * @since 2025/1/9
 */
export interface DougongIsvConfig {
  /** 主键 */
  id?: number
  /** 是否启用 */
  enable?: boolean
  /** 沙箱模式 */
  sandbox?: boolean
  /** 服务商系统ID */
  sysId?: string
  /** 产品号 */
  productId?: string
  /** 斗拱公钥 */
  dgPublicKey?: string
  /** 私钥 */
  privateKey?: string
  /** 微信AppId */
  wxAppId?: string
  /** 微信密钥 */
  wxAppSecret?: string
  /** 微信授权认证地址 */
  wxAuthUrl?: string
  /** 服务商号 */
  isvNo?: string
}
