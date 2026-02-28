import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { MchEntity } from '#/web'

/**
 * 获取单条
 */
export function getConfig(isvNo) {
  return defHttp.get<Result<HkrtIsvConfig>>({
    url: '/hkrt/config/isv/findByIsvNo',
    params: { isvNo },
  })
}

/**
 * 保存或更新
 */
export function update(obj: HkrtIsvConfig) {
  return defHttp.post({
    url: '/hkrt/config/isv/update',
    data: obj,
  })
}

/**
 * 海科服务商配置
 */
export interface HkrtIsvConfig extends MchEntity {
  // 服务商编号
  agentNo?: string
  // 接入机构标识
  accessId?: string
  // 是否启用
  enable: boolean
  // 交易KEY
  tradeKey?: string
  // 密钥
  accessKey?: string
  // 微信渠道号
  wxChannelNo?: string
  // 支付宝渠道号
  aliChannelNo?: string
  // 传输密钥
  transferKey?: string
  // 是否沙箱环境
  sandbox?: boolean
  // 交易API地址
  tradeUrl?: string
  // 其他API地址
  otherUrl?: string
  // 微信使用通道渠道认证
  wxChannelAuth?: boolean
  // 微信AppId
  wxAppId?: string
  // 微信AppSecret
  wxAppSecret?: string
  // 微信授权认证地址
  wxAuthUrl?: string
  // 服务商号
  isvNo?: string
}
