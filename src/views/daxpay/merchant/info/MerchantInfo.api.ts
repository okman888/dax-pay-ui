import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { Merchant } from '@/views/daxpay/admin/merchant/info/Merchant.api'

export interface FeeSetting {
  mchId?: string
  mchNo?: string
  mchName?: string
  feeRate?: number
  status?: string
}

/**
 * 获取商户信息
 */
export const get = () => {
  return defHttp.get<Result<Merchant>>({
    url: '/merchant/get',
  })
}

/**
 * 获取商户费率设置
 */
export const getFeeSetting = () => {
  return defHttp.get<Result<FeeSetting>>({
    url: '/merchant/getFeeSetting',
  })
}
