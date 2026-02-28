import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { MchEntity } from '#/web'

/**
 * 获取单条商户
 */
export function getConfig(appId) {
  return defHttp.get<Result<AlipayConfig>>({
    url: '/alipay/config/findByAppId',
    params: { appId },
  })
}

/**
 * 更新商户
 */
export function update(obj: AlipayConfig) {
  return defHttp.post({
    url: '/alipay/config/update',
    data: obj,
  })
}

/**
 * 获取单条子商户
 */
export function getSubConfig(appId) {
  return defHttp.get<Result<AlipaySubConfig>>({
    url: '/alipay/config/findSubByAppId',
    params: { appId },
  })
}

/**
 * 更新子商户
 */
export function updateSub(obj: AlipaySubConfig) {
  return defHttp.post({
    url: '/alipay/config/updateSub',
    data: obj,
  })
}

/**
 * 支付宝配置
 */
export interface AlipayConfig extends MchEntity {
  // 商户号
  mchNo?: string
  // 商户AppId
  appId?: string
  // 支付宝商户appId
  aliAppId?: string
  // 是否启用
  enable: boolean
  // 是否为特约商户
  isv?: boolean
  // 特约商户Token
  appAuthToken?: string
  // 商户账号ID
  alipayUserId?: string
  // 认证方式
  authType?: string
  // 签名类型
  signType?: string
  // 支付宝公钥
  alipayPublicKey?: string
  // 应用私钥
  privateKey?: string
  // 应用公钥
  appCert?: string
  // 支付宝公钥证书
  alipayCert?: string
  // 支付宝CA根证书
  alipayRootCert?: string
  // 是否沙箱环境
  sandbox?: boolean
}

/**
 * 支付宝子商户配置
 */
export interface AlipaySubConfig extends MchEntity {
  // 服务商号
  isvNo?: string
  // 应用授权令牌
  appAuthToken?: string
  // 是否启用
  enable: boolean
  // 商户账号ID
  alipayUserId?: string
}
