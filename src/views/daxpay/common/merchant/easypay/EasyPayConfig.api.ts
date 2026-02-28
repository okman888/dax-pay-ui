import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { BaseEntity } from '#/web'
import { LabeledValue } from 'ant-design-vue/lib/select'

/**
 * 根据PID查询易支付配置
 */
export function findByPid(pid: number) {
  return defHttp.get<Result<EasyPayConfig>>({
    url: '/epay/config/findByPid',
    params: {
      pid,
    },
  })
}

/**
 * 更新易支付配置
 */
export function update(data: EasyPayConfig) {
  return defHttp.post<Result<void>>({
    url: '/epay/config/update',
    data,
  })
}

/**
 * 根据通道和场景获取支付方式(易支付支付)
 */
export function findMethodByScene(channel, scene) {
  return defHttp.get<Result<LabeledValue[]>>({
    url: '/epay/config/findMethodByScene',
    params: {
      channel,
      scene,
    },
  })
}

/**
 * 易支付配置
 */
export interface EasyPayConfig extends BaseEntity {
  /** 易支付商户ID */
  pid?: number
  /** 限制用户支付方式 */
  limitPay?: string
  /** 开启分账 */
  allocation?: boolean
  /** 自动分账 */
  autoAllocation?: boolean
  /** 微信场景对应通道 */
  wxChannel?: string
  /** 微信场景对应支付方式 */
  wxMethod?: string
  /** 支付宝场景对应通道 */
  alipayChannel?: string
  /** 支付宝场景对应支付方式 */
  alipayMethod?: string
  /** 银联场景对应通道 */
  unionChannel?: string
  /** 银联场景对应支付方式 */
  unionMethod?: string
  /** 商户号 */
  mchNo?: string
  /** 代理商号 */
  agentNo?: string
  /** 服务商号 */
  isvNo?: string
}
