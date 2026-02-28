import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'

/**
 * 分账订单相关接口
 */

/**
 * 创建分账订单
 */
export function createSettleOrder(payOrderNo: string) {
  return defHttp.post<Result>({
    url: '/order/settle/create',
    params: { payOrderNo },
  })
}

/**
 * 同步分账订单状态
 */
export function syncSettleOrder(settleNo: string) {
  return defHttp.post<Result>({
    url: '/order/settle/sync',
    params: { settleNo },
  })
}

/**
 * 根据分账订单号查询详情
 */
export function findBySettleNo(settleNo: string) {
  return defHttp.get<Result>({
    url: '/order/settle/findBySettleNo',
    params: { settleNo },
  })
}

/**
 * 根据ID查询分账订单详情
 */
export function findSettleById(id: number) {
  return defHttp.get<Result>({
    url: '/order/settle/findById',
    params: { id },
  })
}

/**
 * 分页查询分账订单列表
 */
export function pageQuerySettleOrder(params: any) {
  return defHttp.get<Result>({
    url: '/order/settle/page',
    params,
  })
}
