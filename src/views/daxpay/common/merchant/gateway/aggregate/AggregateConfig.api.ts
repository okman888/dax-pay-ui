import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { MchEntity } from '#/web'

/**
 * 聚合扫码支付配置查询
 */
export function findQrByAppId(appId) {
  return defHttp.get<Result<AggregateQrPayConfig>>({
    url: '/aggregate/pay/config/findQrConfigByAppId',
    params: {
      appId,
    },
  })
}

/**
 * 聚合扫码支付配置更新
 */
export function updateQrConfig(data: AggregateQrPayConfig) {
  return defHttp.post<Result<void>>({
    url: '/aggregate/pay/config/updateQrConfig',
    data,
  })
}

/**
 * 聚合付款码支付配置查询
 */
export function findBarByAppId(appId) {
  return defHttp.get<Result<AggregateBarPayConfig>>({
    url: '/aggregate/pay/config/findBarConfigByAppId',
    params: {
      appId,
    },
  })
}

/**
 * 聚合付款码支付配置更新
 */
export function updateBarConfig(data: AggregateBarPayConfig) {
  return defHttp.post<Result<void>>({
    url: '/aggregate/pay/config/updateBarConfig',
    data,
  })
}

/**
 * 聚合二维码支付配置结果
 */
export interface AggregateQrPayConfig extends MchEntity {
  /** 应用ID */
  appId?: string
  /** 自动启动 */
  autoLaunch?: boolean
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

/**
 * 聚合付款码支付配置参数
 */
export interface AggregateBarPayConfig extends MchEntity {
  /** 应用ID */
  appId?: string
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
  /** 支付方式 */
  payMethod?: string
  /** 付款终端号 */
  terminalNo?: string
}
