import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { MchEntity } from '#/web'

/**
 * 根据应用ID查询收银码牌配置
 */
export function findByAppId(appId) {
  return defHttp.get<Result<CashierCodeConfig>>({
    url: '/cashier/code/config/findByAppId',
    params: {
      appId,
    },
  })
}

/**
 * 更新收银码牌配置
 */
export function update(data: CashierCodeConfig) {
  return defHttp.post<Result<void>>({
    url: '/cashier/code/config/update',
    data,
  })
}

/**
 * 收银码牌配置参数
 */
export interface CashierCodeConfig extends MchEntity {
  /** 应用ID */
  appId?: string
  /** 限制用户支付方式 */
  limitPay?: string
  /** 微信通道 */
  wxChannel?: string
  /** 微信支付方式 */
  wxMethod?: string
  /** 支付宝通道 */
  alipayChannel?: string
  /** 支付宝支付方式 */
  alipayMethod?: string
  /** 银联通道 */
  unionChannel?: string
  /** 银联支付方式 */
  unionMethod?: string
}
