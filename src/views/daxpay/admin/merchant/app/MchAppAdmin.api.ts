import { defHttp } from '@/utils/http/axios'
import { PageResult, Result } from '#/axios'
import {BaseEntity, MchEntity} from '#/web'

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get<Result<PageResult<MchApp>>>({
    url: '/admin/mch/app/page',
    params,
  })
}
/**
 * 详情
 */
export const get = (id) => {
  return defHttp.get<Result<MchApp>>({
    url: '/admin/mch/app/findById',
    params: { id },
  })
}
/**
 * 新增
 */
export const add = (obj) => {
  return defHttp.post<Result<void>>({
    url: '/admin/mch/app/add',
    data: obj,
  })
}
/**
 * 更新
 */
export const update = (obj) => {
  return defHttp.post<Result<void>>({
    url: '/admin/mch/app/update',
    data: obj,
  })
}

/**
 * 删除
 */
export const del = (id) => {
  return defHttp.post<Result<void>>({
    url: '/admin/mch/app/delete',
    params: { id },
  })
}

/**
 * 设为默认
 */
export const setDefault = (id) => {
  return defHttp.post<Result<void>>({
    url: '/admin/mch/app/setDefault',
    params: { id },
  })
}

/**
 * 清除默认
 */
export const clearDefault = (id) => {
  return defHttp.post<Result<void>>({
    url: '/admin/mch/app/clearDefault',
    params: { id },
  })
}

/**
 * 商户应用
 */
export interface MchApp extends MchEntity {
  // 通知地址, http/WebSocket 需要配置
  notifyUrl?: string
  // 状态
  status?: string
}
