import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { LabeledValue } from 'ant-design-vue/lib/select'

/**
 * 查询服务商下拉列表
 */
export function dropdown() {
  return defHttp.get<Result<LabeledValue[]>>({
    url: '/isv/query/dropdown',
  })
}

/**
 * 查询启用的服务商下拉列表
 */
export function dropdownByEnable() {
  return defHttp.get<Result<LabeledValue[]>>({
    url: '/isv/query/dropdownByEnable',
  })
}
