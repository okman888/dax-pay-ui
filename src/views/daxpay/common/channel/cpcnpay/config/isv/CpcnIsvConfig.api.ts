import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'

/**
 * 获取单条
 */
export function getConfig(isvNo) {
  return defHttp.get<Result<CpcnIsvConfig>>({
    url: '/cpcnpay/config/isv/findByIsvNo',
    params: { isvNo },
  })
}

/**
 * 保存或更新
 */
export function update(obj: CpcnIsvConfig) {
  return defHttp.post({
    url: '/cpcnpay/config/isv/update',
    data: obj,
  })
}

/**
 * 中金支付服务商配置
 * @author xxm
 * @since 2025/8/27
 */
export interface CpcnIsvConfig {
  /** 主键 */
  id?: number
  /** 是否启用 */
  enable?: boolean
  /** 沙箱模式 */
  sandbox?: boolean
  /** 中金机构号 */
  institutionId?: string
  /** 服务商号 */
  isvNo?: string
  /** 是否使用数字信封 */
  isDgEnv?: boolean
  /** 签名证书 */
  keystoreFile?: string
  /** 签名口令 */
  keystorePassword?: string
  /** 平台公钥证书 */
  certificateFile?: string
}