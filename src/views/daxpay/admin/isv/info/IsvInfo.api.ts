import { defHttp } from '@/utils/http/axios'
import { PageResult, Result } from '#/axios'
import { BaseEntity } from '#/web'
import { LabeledValue } from 'ant-design-vue/lib/select'

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get<Result<PageResult<IsvInfo>>>({
    url: '/admin/isv/info/page',
    params,
  })
}
/**
 * 详情
 */
export const get = (id) => {
  return defHttp.get<Result<IsvInfo>>({
    url: '/admin/isv/info/findById',
    params: { id },
  })
}
/**
 * 新增
 */
export const add = (obj) => {
  return defHttp.post<Result<void>>({
    url: '/admin/isv/info/add',
    data: obj,
  })
}
/**
 * 更新
 */
export const update = (obj) => {
  return defHttp.post<Result<void>>({
    url: '/admin/isv/info/update',
    data: obj,
  })
}

/**
 * 删除
 */
export const del = (id) => {
  return defHttp.post<Result<void>>({
    url: '/admin/isv/info/delete',
    params: { id },
  })
}

/**
 * 商户应用
 */
export interface IsvInfo extends BaseEntity {
  // 服务商名称
  name?: string
  // 服务商号
  isvNo?: string
  // 状态
  status?: string
}
