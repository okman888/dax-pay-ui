import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'

/**
 * 生成签名字符串
 */
export function genSignStr(param: string) {
  return defHttp.post<Result<string>>({
    url: '/develop/sign/genSignStr',
    data: { param },
  })
}

/**
 * 生成签名
 */
export function genSign(param: string, privateKey: string) {
  return defHttp.post<Result<string>>({
    url: '/develop/sign/genSign',
    data: { param, privateKey },
  })
}

/**
 * 验证签名
 */
export function verifySign(param: string, publicKey: string) {
  return defHttp.post<Result<boolean>>({
    url: '/develop/sign/verifySign',
    data: { param, publicKey },
  })
}
