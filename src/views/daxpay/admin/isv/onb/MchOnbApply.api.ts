import { defHttp } from '@/utils/http/axios'
import { PageResult, Result } from '#/axios'
import { BaseEntity } from '#/web'

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get<Result<PageResult<ApplyOrder>>>({
    url: '/isv/onboard/apply/page',
    params,
  })
}

/**
 * 获取进件单详情
 */
export const get = (id) => {
  return defHttp.get<Result<ApplyOrder>>({
    url: '/isv/onboard/apply/findById/' + id,
  })
}

/**
 * 新建进件申请单
 */
export const add = (obj) => {
  return defHttp.post<Result<ApplyOrder>>({
    url: '/isv/onboard/apply/add',
    data: obj,
  })
}

/**
 * 更新/暂存进件材料
 */
export const update = (obj) => {
  return defHttp.put<Result<void>>({
    url: '/isv/onboard/apply/update',
    data: obj,
  })
}

/**
 * 提交进件申请至第三方通道
 */
export const submitApply = (id) => {
  return defHttp.put<Result<void>>({
    url: '/isv/onboard/apply/update',
    params: { id },
  })
}

/**
 * 同步通道方最新审核状态
 */
export const syncStatus = (obj) => {
  return defHttp.get<Result<void>>({
    url: '/isv/onboard/apply/sync/' + obj.id,
  })
}

/**
 * 删除申请单
 */
export const del = (id) => {
  return defHttp.post<Result<void>>({
    url: '/isv/onboard/apply/delete',
    params: { id },
  })
}

/**
 * 获取商户基础资料(用于一键读取填充)
 */
export const getMchBaseData = (mchNo) => {
  return defHttp.get<Result<any>>({
    url: '/isv/onboard/apply/getMchBaseData/' + mchNo,
  })
}

/**
 * 进件推送
 */
export const pushApply = (id) => {
  return defHttp.get<Result<void>>({
    url: '/isv/onboard/apply/push/' + id,
  })
}

/**
 * 进件申请实体
 */
export interface ApplyOrder extends BaseEntity {
  // 进件名称
  applyName?: string
  mchId?: number | string
  mchNo?: string
  // 通道编码
  channel?: string
  // 进件类型
  applyType?: string
  // 内部状态
  status?: string
  // 通道状态
  channelStatus?: string
  // 错误提示
  errorMsg?: string
  // 材料JSON字符串
  applyData?: string
}
