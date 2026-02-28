import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { BaseEntity } from '#/web'

/**
 * 获取网关支付配置
 */
export function getConfig(appId) {
  return defHttp.get<Result<GatewayPayConfig>>({
    url: '/gateway/pay/config/getConfig',
    params: {
      appId,
    },
  })
}

/**
 * 更新网关支付配置
 */
export function update(data: GatewayPayConfig) {
  return defHttp.post<Result<void>>({
    url: '/gateway/pay/config/update',
    data,
  })
}

/**
 * 获取网关支付配置
 */
export function getReadConfig(appId) {
  return defHttp.get<Result<GatewayPayReadConfig>>({
    url: '/gateway/pay/config/getReadConfig',
    params: {
      appId,
    },
  })
}

/**
 * 更新网关支付配置
 */
export function updateReadConfig(data: GatewayPayReadConfig) {
  return defHttp.post<Result<void>>({
    url: '/gateway/pay/config/updateReadConfig',
    data,
  })
}

/**
 * 网关支付配置参数
 */
export interface GatewayPayConfig extends BaseEntity {
  /** 应用ID */
  appId?: string
  /** 聚合二维码是否显示 */
  aggregateQrShow?: boolean
  /** h5收银台自动升级聚合支付 */
  h5AutoUpgrade?: boolean
}

/**
 * 网关支付读取配置参数
 */
export interface GatewayPayReadConfig extends BaseEntity {
  /** 应用ID */
  appId?: string
  /** 是否读取系统配置 */
  gatewayReadSystem?: boolean
  /** h5是否读取系统配置 */
  h5ReadSystem?: boolean
  /** pc是否读取系统配置 */
  pcReadSystem?: boolean
  /** 聚合二维码是否读取系统配置 */
  aggregateQrReadSystem?: boolean
  /** 聚合条码是否读取系统配置 */
  aggregateBarReadSystem?: boolean
  /** 小程序是否读取系统配置 */
  miniQuicklyReadSystem?: boolean
}
