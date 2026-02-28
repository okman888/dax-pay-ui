import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { MchEntity } from '#/web'

/**
 * 获取单条
 */
export function getConfig(isvNo) {
  return defHttp.get<Result<FouyouIsvConfig>>({
    url: '/isv/fuyou/config/findByIsvNo',
    params: { isvNo },
  })
}

/**
 * 保存或更新
 */
export function update(obj: FouyouIsvConfig) {
  return defHttp.post({
    url: '/isv/fuyou/config/update',
    data: obj,
  })
}

/**
 * 富友支付服务商配置
 * @author xxm
 * @since 2025/8/27
 */
export interface FouyouIsvConfig {
  /** 主键 */
  id?: number
  /** 是否启用 */
  enable?: boolean
  /** 沙箱模式 */
  sandbox?: boolean
  /** 富友支付应用编号 */
  fyAppId?: string
  /** 富友进件密钥 */
  onbKey?: string
  /** 订单前缀 */
  orderPrefix?: string
  /** 私钥 */
  privateKey?: string
  /** 公钥 */
  publicKey?: string
  /** 微信AppId */
  wxAppId?: string
  /** 微信使用通道渠道认证 */
  wxChannelAuth?: boolean
  /** 微信密钥 */
  wxAppSecret?: string
  /** 微信授权认证地址 */
  wxAuthUrl?: string
  /** 服务商号 */
  isvNo?: string
}
