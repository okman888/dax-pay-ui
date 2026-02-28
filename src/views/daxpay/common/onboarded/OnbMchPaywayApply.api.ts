import { defHttp } from '@/utils/http/axios'
import { PageResult, Result } from '#/axios'
import { LabeledValue } from 'ant-design-vue/lib/select'

/**
 * 分页查询支付方式开通历史
 */
export function page(params) {
  return defHttp.get<Result<PageResult<OnbMchPayway>>>({
    url: '/isv/onboard/payway/page',
    params,
  })
}

/**
 * 根据进件商户ID查询支付方式开通历史
 */
export function findByOnbMchNo(onbMchNo) {
  return defHttp.get<Result<OnbMchPayway[]>>({
    url: '/isv/onboard/payway/findByOnbMchNo/' + onbMchNo,
  })
}

/**
 * 新增支付方式开通
 */
export function add(obj) {
  return defHttp.post<Result<void>>({
    url: '/isv/onboard/payway/add',
    data: obj,
  })
}

/**
 * 同步支付方式状态
 */
export function statusQuery(id) {
  return defHttp.get<Result<void>>({
    url: '/isv/onboard/payway/statusQuery/' + id,
  })
}

/**
 * 删除支付方式开通
 */
export function del(id) {
  return defHttp.post<Result<void>>({
    url: '/isv/onboard/payway/delete/' + id,
  })
}

/**
 * 推送支付方式开通
 */
export function push(id) {
  return defHttp.get<Result<void>>({
    url: '/isv/onboard/payway/push/' + id,
  })
}

/**
 * 获取支付方式下拉选项
 */
export function dropdown() {
  return defHttp.get<Result<LabeledValue[]>>({
    url: '/const/method/dropdown',
  })
}

/**
 * 支付方式开通信息
 */
export interface OnbMchPayway {
  id?: string
  onbMchId?: string
  onbIsvNo?: string
  onbMchNo?: string
  payWay?: string
  payType?: string | string[]
  bizCategory?: string
  onbChannel?: string
  status?: string
  channelStatus?: string
  channelResult?: string
  channelTrxNo?: string
  errorMsg?: string
  createTime?: string
  updateTime?: string
}
