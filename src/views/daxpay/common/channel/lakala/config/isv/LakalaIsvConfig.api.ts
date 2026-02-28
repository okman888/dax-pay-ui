import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { MchEntity } from '#/web'

/**
 * 获取单条
 */
export function getConfig(isvNo) {
  return defHttp.get<Result<LakalaIsvConfig>>({
    url: '/isv/lakala/config/findByIsvNo',
    params: { isvNo },
  })
}

/**
 * 保存或更新
 */
export function update(obj: LakalaIsvConfig) {
  return defHttp.post({
    url: '/isv/lakala/config/update',
    data: obj,
  })
}

/**
 * 拉卡拉服务商配置
 * @author xxm
 * @since 2025/8/27
 */
export interface LakalaIsvConfig {
  /** 主键 */
  id?: number
  /** 是否启用 */
  enable?: boolean
  /** 沙箱模式 */
  sandbox?: boolean
  /** 拉卡拉应用编号 */
  lklAppId?: string
  /** 商户证书序列号 */
  mchSerialNo?: string
  /** 私钥 */
  privateKey?: string
  /** 公钥 */
  publicKey?: string
  /** sm4密钥 */
  sm4Key?: string
  /** 微信AppId */
  wxAppId?: string
  /** 微信密钥 */
  wxAppSecret?: string
  /** 微信授权认证地址 */
  wxAuthUrl?: string
  /** 服务商号 */
  isvNo?: string
}
