import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { BaseEntity } from '#/web'

/**
 * 获取网关支付配置
 */
export function getConfig(isvNo) {
  return defHttp.get<Result<GatewayConfig>>({
    url: '/isv/gateway/pay/config/getConfig',
    params: {
      isvNo,
    },
  })
}

/**
 * 更新网关支付配置
 */
export function updateConfig(data: GatewayConfig) {
  return defHttp.post<Result<void>>({
    url: '/isv/gateway/pay/config/update',
    data,
  })
}

/**
 * ISV网关支付配置参数
 */
export interface GatewayConfig extends BaseEntity {
  /** 服务商号 */
  isvNo?: string
  /** 聚合二维码是否显示 */
  aggregateShow?: boolean
  /** h5收银台自动升级聚合支付 */
  h5AutoUpgrade?: boolean
}
