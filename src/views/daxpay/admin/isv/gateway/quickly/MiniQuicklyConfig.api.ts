import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { BaseEntity } from '#/web'

/**
 * 根据服务商号查询配置
 */
export function findByIsvNo(isvNo) {
  return defHttp.get<Result<IsvMiniQuicklyConfigResult>>({
    url: '/isv/mini/quickly/config/findByIsvNo',
    params: {
      isvNo,
    },
  })
}

/**
 * 更新配置
 */
export function update(data: IsvMiniQuicklyConfigParam) {
  return defHttp.post<Result<void>>({
    url: '/isv/mini/quickly/config/update',
    data,
  })
}

/**
 * ISV小程序快捷支付配置参数
 */
export interface IsvMiniQuicklyConfigParam extends BaseEntity {
  /** 服务商号 */
  isvNo?: string
  /** 限制支付方式 */
  limitPay?: string
  /** 关联终端号 */
  terminalNo?: string
}

/**
 * ISV小程序快捷支付配置结果
 */
export interface IsvMiniQuicklyConfigResult extends BaseEntity {
  /** 服务商号 */
  isvNo?: string
  /** 限制支付方式 */
  limitPay?: string
  /** 关联终端号 */
  terminalNo?: string
}
