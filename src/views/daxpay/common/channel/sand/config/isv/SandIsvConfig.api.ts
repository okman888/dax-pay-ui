import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'

/**
 * 获取单条
 */
export function getConfig(isvNo) {
  return defHttp.get<Result<SandIsvConfig>>({
    url: '/isv/sand/config/findByIsvNo',
    params: { isvNo },
  })
}

/**
 * 保存或更新
 */
export function update(obj: SandIsvConfig) {
  return defHttp.post({
    url: '/isv/sand/config/update',
    data: obj,
  })
}

/**
 * 杉德支付服务商配置
 * @author xxm
 * @since 2025/8/27
 */
export interface SandIsvConfig {
  /** 主键 */
  id?: number
  /** 是否启用 */
  enable?: boolean
  /** 沙箱模式 */
  sandbox?: boolean
  /** 杉德代理应用编号 */
  sandAppId?: string
  /** 支付产品编号 */
  productCode?: string
  /** 私钥 */
  privateKey?: string
  /** 公钥 */
  publicKey?: string
  /** 微信使用通道渠道认证 */
  wxChannelAuth?: boolean
  /** 微信AppId */
  wxAppId?: string
  /** 微信密钥 */
  wxAppSecret?: string
  /** 微信授权认证地址 */
  wxAuthUrl?: string
  /** 服务商号 */
  isvNo?: string
}
