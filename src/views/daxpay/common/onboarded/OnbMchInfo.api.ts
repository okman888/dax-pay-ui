import { defHttp } from '@/utils/http/axios'
import { PageResult, Result } from '#/axios'
import { MchEntity } from '#/web'
import { LabeledValue } from 'ant-design-vue/lib/select'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<OnbMchInfo>>>({
    url: '/onb/mch/page',
    params,
  })
}

/**
 * 列表
 */
export function list() {
  return defHttp.get<Result<OnbMchInfo[]>>({
    url: '/onb/mch/list',
  })
}

/**
 * 详情
 */
export function get(id) {
  return defHttp.get<Result<OnbMchInfo>>({
    url: '/onb/mch/findById',
    params: { id },
  })
}

/**
 * 根据进件商户号、商户号和所属通道判断是否存在
 */
export function existsByOnbMchNo(onbMchNo: string, mchNo: string, onbChannel: string) {
  return defHttp.get<Result<boolean>>({
    url: '/onb/mch/existsByOnbMchNo',
    params: { onbMchNo, mchNo, onbChannel },
  })
}

/**
 * 根据所属通道查询进件商户信息
 */
export function findByChannel(mchNo, channel) {
  return defHttp.get<Result<LabeledValue[]>>({
    url: '/onb/mch/findByChannel',
    params: { mchNo, channel },
  })
}

/**
 * 新增
 */
export function add(obj) {
  return defHttp.post<Result<void>>({
    url: '/onb/mch/add',
    data: obj,
  })
}

/**
 * 更新
 */
export function update(obj) {
  return defHttp.post<Result<void>>({
    url: '/onb/mch/update',
    data: obj,
  })
}

/**
 * 删除
 */
export function del(id) {
  return defHttp.post<Result<void>>({
    url: '/onb/mch/delete',
    params: { id },
  })
}

/**
 * 进件商户信息
 */
export interface OnbMchInfo extends MchEntity {
  // 进件商户号
  onbMchNo?: string
  // 进件商户名称
  onbMchName?: string
  // 所属通道
  onbChannel?: string
}
