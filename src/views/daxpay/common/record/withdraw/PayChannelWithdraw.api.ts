import { defHttp } from '@/utils/http/axios'
import { PageResult, Result } from '#/axios'
import { MchEntity } from '#/web'

/**
 * 分页获取渠道提现记录
 */
export function page(params) {
  return defHttp.get<Result<PageResult<PayChannelWithdrawRecord>>>({
    url: '/pay/channel/withdraw/page',
    params,
  })
}

/**
 * 同步渠道提现状态
 */
export function sync(id) {
  return defHttp.post<Result<any>>({
    url: `/pay/channel/withdraw/sync/${id}`,
  })
}

/**
 * 查询渠道用户信息
 */
export function getUserInfo(params) {
  return defHttp.get<Result<ChannelUserInfo>>({
    url: '/pay/channel/withdraw/user/info',
    params,
  })
}

/**
 * 提交渠道提现申请
 */
export function submit(params) {
  return defHttp.post<Result<PayChannelWithdrawRecord>>({
    url: '/pay/channel/withdraw/submit',
    data: params,
  })
}

/**
 * 获取单条渠道提现记录
 */
export function get(id) {
  return defHttp.get<Result<PayChannelWithdrawRecord>>({
    url: `/pay/channel/withdraw/detail/${id}`,
  })
}

/**
 * 根据渠道查询进件商户下拉列表
 */
export function getOnbMchDropdown(channel: string, mchNo?: string) {
  return defHttp.get<Result<Array<LabelValue>>>({
    url: '/onb/mch/dropdownByChannel',
    params: { channel, mchNo },
  })
}

/**
 * 标签值
 */
export interface LabelValue {
  // 标签
  label?: string
  // 值
  value?: string
}

/**
 * 渠道提现记录
 */
export interface PayChannelWithdrawRecord extends MchEntity {
  // ID
  id?: number
  // 提现编号
  withdrawNo?: string
  // 渠道
  channel?: string
  // 提现金额
  amount?: number
  // 状态
  status?: string
  // 创建时间
  createTime?: string
  // 商户号
  mchNo?: string
  // 所属服务商
  isvNo?: string
}

/**
 * 渠道用户信息
 */
export interface ChannelUserInfo {
  // 用户名称
  userName?: string
  // 用户ID
  userId?: string
  // 可用账户余额 (单位: 分)
  balance?: string
  // 到账余额 (单位: 分)
  receivedBalance?: string
  // 在途余额 (单位: 分)
  receivableBalance?: string
  // 冻结账户余额 (单位: 分)
  frozenAmount?: string
  // 用户类型
  userType?: string
  // 账户状态
  status?: string
}
