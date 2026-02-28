import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { BaseEntity } from '#/web'

/**
 * 获取指定类型收银台分组列表
 */
export function listByType(appId: string, type: string) {
  return defHttp.get<Result<CheckoutCounterConfig[]>>({
    url: '/checkout/counter/config/listByType',
    params: {
      appId,
      type,
    },
  })
}

/**
 * 获取收银台配置
 */
export function findById(id) {
  return defHttp.get<Result<CheckoutCounterConfig>>({
    url: '/checkout/counter/config/findById',
    params: { id },
  })
}

/**
 * 保存收银台配置
 */
export function save(data: CheckoutCounterConfig) {
  return defHttp.post<Result<void>>({
    url: '/checkout/counter/config/save',
    data,
  })
}

/**
 * 修改收银台配置
 */
export function update(data: CheckoutCounterConfig) {
  return defHttp.post<Result<void>>({
    url: '/checkout/counter/config/update',
    data,
  })
}

/**
 * 删除收银台配置
 */
export function deleteConfig(id) {
  return defHttp.post<Result<void>>({
    url: '/checkout/counter/config/delete',
    data: id,
  })
}

/**
 * 收银台配置
 */
export interface CheckoutCounterConfig extends BaseEntity {
  /** 应用ID */
  appId?: string
  /** 类型 */
  type?: string
  /** 名称 */
  name?: string
  /** 图标 */
  icon?: string
  /** 排序 */
  sortNo?: number
  /** 背景色 */
  bgColor?: string
  /** 是否推荐 */
  recommend?: boolean
  /** 发起调用的类型 */
  callType?: string
  /** 支付通道 */
  channel?: string
  /** 支付方式 */
  payMethod?: string
  /** 其他支付方式 */
  otherMethod?: string
}