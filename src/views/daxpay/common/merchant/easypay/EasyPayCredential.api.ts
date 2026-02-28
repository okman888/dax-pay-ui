import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { BaseEntity } from '#/web'

/**
 * 根据商户号查询易支付凭证配置
 */
export function findByMchNo(mchNo: string) {
  return defHttp.get<Result<EasyPayCredential>>({
    url: '/epay/credential/findByMchNo',
    params: {
      mchNo,
    },
  })
}

/**
 * 更新易支付凭证配置
 */
export function update(data: EasyPayCredential) {
  return defHttp.post<Result<void>>({
    url: '/epay/credential/update',
    data,
  })
}

/**
 * 易支付凭证配置
 */
export interface EasyPayCredential extends BaseEntity {
  /** 易支付商户号 */
  pid?: number
  /** 启用状态 */
  enable?: boolean
  /** 关联商户应用ID */
  appId?: string
  /** 开启V1接口 */
  enableV1?: boolean
  /** 开启V2接口 */
  enableV2?: boolean
  /** 商户MD5密钥 */
  md5Key?: string
  /** 使用系统公私钥 */
  useSystemKey?: boolean
  /** RSA平台公钥 */
  platformPublicKey?: string
  /** RSA商户公钥 */
  publicKey?: string
  /** 商户号 */
  mchNo?: string
  /** 代理商号 */
  agentNo?: string
  /** 服务商号 */
  isvNo?: string
}
