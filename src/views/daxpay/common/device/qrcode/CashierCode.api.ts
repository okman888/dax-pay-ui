import { defHttp } from '@/utils/http/axios'
import { PageResult, Result } from '#/axios'
import { MchEntity } from '#/web'

/**
 * 分页查询
 */
export function page(queryParam) {
  return defHttp.get<Result<PageResult<CashierCode>>>({
    url: '/cashier/code/page',
    params: queryParam,
  })
}

/**
 * 查询详情
 */
export function get(id) {
  return defHttp.get<Result<CashierCode>>({
    url: '/cashier/code/findById',
    params: { id },
  })
}

/**
 * 批量创建
 */
export function createBatch(data: CashierCodeBatch) {
  return defHttp.post<Result<CashierCode>>({
    url: '/cashier/code/createBatch',
    data,
  })
}

/**
 * 修改
 */
export function update(data) {
  return defHttp.post<Result<void>>({
    url: '/cashier/code/update',
    data,
  })
}

/**
 * 批量导出码牌
 */
export function exportBatch(data) {
  return defHttp.post<Result<File>>({
    url: '/cashier/code/exportBatch',
    data: data,
    responseType: 'blob',
  })
}

/**
 * 批量设置码牌配置
 */
export function setCodeConfigBatch(data) {
  return defHttp.post<Result<void>>({
    url: '/cashier/code/setupBatchConfig',
    data,
  })
}

/**
 * 分配代理商
 */
export function assignAgent(data) {
  return defHttp.post<Result<void>>({
    url: '/cashier/code/assignAgent',
    data,
  })
}

/**
 * 取消分配代理商
 */
export function recoverAgent(data) {
  return defHttp.post<Result<void>>({
    url: '/cashier/code/recoverAgent',
    data,
  })
}

/**
 * 绑定商户和应用
 */
export function bindMch(data) {
  return defHttp.post<Result<void>>({
    url: '/cashier/code/bindMerchant',
    data,
  })
}

/**
 * 取消绑定商户
 */
export function unbindMch(data) {
  return defHttp.post<Result<void>>({
    url: '/cashier/code/unbindMerchant',
    data,
  })
}

/**
 * 绑定应用
 */
export function bindApp(data) {
  return defHttp.post<Result<void>>({
    url: '/cashier/code/bindApp',
    data,
  })
}

/**
 * 解绑应用
 */
export function unbindApp(data) {
  return defHttp.post<Result<void>>({
    url: '/cashier/code/unbindApp',
    data,
  })
}

/**
 * 绑定空白码牌
 */
export function bindBlank(data) {
  return defHttp.post<Result<void>>({
    url: '/cashier/code/bindBlank',
    data,
  })
}

/**
 * 删除
 */
export function del(id) {
  return defHttp.post<Result<void>>({
    url: '/cashier/code/delete',
    params: { id },
  })
}

/**
 * 判断是否存在
 */
export function existsByBatchNo(batchNo) {
  return defHttp.get<Result<boolean>>({
    url: '/cashier/code/existsByBatchNo',
    params: { batchNo },
  })
}
/**
 * 判断是否存在
 */
export function getCodeLink(code) {
  return defHttp.get<Result<string>>({
    url: '/cashier/code/getCodeLink',
    params: { code },
  })
}

/**
 * 收款码牌
 */
export interface CashierCode extends MchEntity {
  /** 名称 */
  name?: string
  /** 固定金额/任意金额 */
  amountType?: string
  /** 金额 */
  amount?: number
  /** 编号 */
  code?: string
  /** 模板ID */
  templateId?: number
  /** 状态 */
  enable?: boolean
  /** 批次号 */
  batchNo?: string
  /** 读取系统配置 */
  readSystem?: boolean
  /** 微信通道 */
  wxChannel?: string
  /** 微信支付方式 */
  wxMethod?: string
  /** 支付宝通道 */
  alipayChannel?: string
  /** 支付宝支付方式 */
  alipayMethod?: string
  /** 银联通道 */
  unionChannel?: string
  /** 银联支付方式 */
  unionMethod?: string
}

/**
 * 批量创建收款码参数
 * @author xxm
 * @since 2025/7/1
 */
export interface CashierCodeBatch {
  /** 批次号 */
  batchNo?: string
  /** 创建数量 */
  count?: number
  /** 模板Id */
  templateId?: number
  /** 金额类型 */
  amountType?: string
  /** 金额 */
  amount?: number
  /** 状态 */
  enable?: boolean
  /** 读取系统配置 */
  readSystem?: boolean
  /** 微信通道 */
  wxChannel?: string
  /** 微信支付方式 */
  wxMethod?: string
  /** 支付宝通道 */
  alipayChannel?: string
  /** 支付宝支付方式 */
  alipayMethod?: string
  /** 银联通道 */
  unionChannel?: string
  /** 银联支付方式 */
  unionMethod?: string
}
