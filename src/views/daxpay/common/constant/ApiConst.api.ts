import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { BaseEntity } from '#/web'

/**
 * 分页
 */
export const apiList = () => {
  return defHttp.get<Result<ChannelConst[]>>({
    url: '/const/api/list',
  })
}

export interface ChannelConst extends BaseEntity {
  /** 编码 */
  code?: string
  /** 名称 */
  name?: string
  /** 接口地址 */
  api?: string
  /** 是否启用 */
  enable?: boolean
  /** 备注 */
  remark?: string
}
