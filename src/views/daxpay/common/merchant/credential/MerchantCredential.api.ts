import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { MchEntity } from '#/web'

/**
 * 根据商户号查询商户API配置
 */
export function findByMchNo(mchNo: string) {
  return defHttp.get<Result<MerchantCredential>>({
    url: '/merchant/credential/findByMchNo',
    params: { mchNo },
  })
}

/**
 * 更新商户API配置
 */
export function update(obj: MerchantCredential) {
  return defHttp.post({
    url: '/merchant/credential/update',
    data: obj,
  })
}

/**
 * 商户API配置参数
 */
export interface MerchantCredential extends MchEntity {
  /** 商户公钥 */
  publicKey?: string
  /** 平台公钥 */
  platformPublicKey?: string
  /** 通信密钥 */
  secretKey?: string
}
