import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { MchEntity } from '#/web'
import { unref } from 'vue'

/**
 * 配置列表
 */
export function findAll(isvNo) {
  return defHttp.get<Result<IsvChannelConfig[]>>({
    url: '/isv/channel/config/findAllByIsvNo',
    params: {
      isvNo: unref(isvNo),
    },
  })
}

/**
 * 服务商通道配置
 */
export interface IsvChannelConfig extends MchEntity {
  channel?: string
  // 通道名称
  name?: string
  // 是否启用
  enable?: boolean
  // 通道服务商号
  outIsvNo?: string
  // 服务商号
  isvNo?: string
}
