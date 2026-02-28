import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { BaseEntity } from '#/web'

/**
 * 获取聚合二维码配置详情
 */
export function findQrByIsvNo(isvNo) {
  return defHttp.get<Result<IsvAggregatePayConfig>>({
    url: '/isv/aggregate/pay/config/findQrByIsvNo',
    params: {
      isvNo,
    },
  })
}

/**
 * 更新聚合二维码支付配置
 */
export function updateQrConfig(data: IsvAggregatePayConfig) {
  return defHttp.post<Result<void>>({
    url: '/isv/aggregate/pay/config/updateQrConfig',
    data,
  })
}

/**
 * 获取聚合付款码配置详情
 */
export function findBarByIsvNo(isvNo) {
  return defHttp.get<Result<IsvAggregateBarPayConfig>>({
    url: '/isv/aggregate/pay/config/findBarByIsvNo',
    params: {
      isvNo,
    },
  })
}

/**
 * 更新聚合付款码支付配置
 */
export function updateBarConfig(data: IsvAggregateBarPayConfig) {
  return defHttp.post<Result<void>>({
    url: '/isv/aggregate/pay/config/updateBarConfig',
    data,
  })
}

/**
 * ISV聚合二维码支付配置参数
 */
export interface IsvAggregatePayConfig extends BaseEntity {
  /** 服务商号 */
  isvNo?: string
  /** 自动拉起支付 */
  autoLaunch?: boolean
  /** 微信场景对应通道 */
  wxChannel?: string
  /** 微信场景对应支付方式 */
  wxMethod?: string
  /** 支付宝场景对应通道 */
  alipayChannel?: string
  /** 支付宝场景对应支付方式 */
  alipayMethod?: string
  /** 银联场景对应通道 */
  unionChannel?: string
  /** 银联场景对应支付方式 */
  unionMethod?: string
}

/**
 * ISV聚合付款码支付配置参数
 */
export interface IsvAggregateBarPayConfig extends BaseEntity {
  /** 服务商号 */
  isvNo?: string
  /** 微信场景对应通道 */
  wxChannel?: string
  /** 微信场景对应支付方式 */
  wxMethod?: string
  /** 支付宝场景对应通道 */
  alipayChannel?: string
  /** 支付宝场景对应支付方式 */
  alipayMethod?: string
  /** 银联场景对应通道 */
  unionChannel?: string
  /** 银联场景对应支付方式 */
  unionMethod?: string
}
