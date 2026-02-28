import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { BaseEntity } from '#/web'

/**
 * 根据应用ID查询配置
 */
export function findByAppId(appId) {
  return defHttp.get<Result<MchMiniQuicklyConfigResult>>({
    url: '/mch/mini/quickly/config/findByAppId',
    params: {
      appId,
    },
  })
}

/**
 * 更新配置
 */
export function update(data: MchMiniQuicklyConfigParam) {
  return defHttp.post<Result<void>>({
    url: '/mch/mini/quickly/config/update',
    data,
  })
}

/**
 * 商户小程序快捷支付配置参数
 */
export interface MchMiniQuicklyConfigParam extends BaseEntity {
  /** 应用ID */
  appId?: string
  /** 限制支付方式 */
  limitPay?: string
  /** 关联终端号 */
  terminalNo?: string
}

/**
 * 商户小程序快捷支付配置结果
 */
export interface MchMiniQuicklyConfigResult extends BaseEntity {
  /** 应用ID */
  appId?: string
  /** 限制支付方式 */
  limitPay?: string
  /** 关联终端号 */
  terminalNo?: string
}
