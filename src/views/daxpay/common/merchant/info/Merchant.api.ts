import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'

/**
 * 经营信息表单数据
 */
export interface BusinessForm {
  id?: string
  mchId: string
  mchNo: string
  storeName: string
  businessType: string
  region: string[]
  province: string
  city: string
  area: string
  detailedAddress: string
  storeDoorImgUrl: string
  storeInnerImgUrl: string
  cashierDeskImgUrl: string
}

/**
 * 结算信息表单数据
 */
export interface SettlementForm {
  id?: string
  accountType: string
  bankCardFrontImg: string
  bankCardBackImg: string
  accountName: string
  accountNo: string
  mobile: string
  bankName: string
  bankLineNo: string
}

/**
 * 主体信息表单数据
 */
export interface SubjectForm {
  id?: string
  mchType: string
  mchName: string
  mchShortName: string
  idCardFrontUrl: string
  idCardBackUrl: string
  legalPersonName: string
  idCardNo: string
  idCardLongTerm: boolean
  idCardDateRange: [string, string] | null
  idCardAddress: string
  contact: string
}

/**
 * 费率设置表单数据
 */
export interface FeeSettingForm {
  id?: string
  mchId: string
  mchNo: string
  mchName: string
  feeRate: number
  status: string
}

/**
 * 保存主体信息
 */
export const saveSubjectInfo = (obj: SubjectForm) => {
  return defHttp.post<Result<void>>({
    url: '/admin/merchant/saveSubject',
    data: obj,
  })
}

/**
 * 保存经营信息
 */
export const saveBusinessInfo = (obj: BusinessForm) => {
  return defHttp.post<Result<void>>({
    url: '/admin/merchant/saveBusiness',
    data: obj,
  })
}

/**
 * 保存结算信息
 */
export const saveSettlementInfo = (obj: SettlementForm) => {
  return defHttp.post<Result<void>>({
    url: '/admin/merchant/saveSettlement',
    data: obj,
  })
}

/**
 * 获取商户信息
 */
export const getMerchantInfo = (mchId: string) => {
  return defHttp.get<Result<SubjectForm>>({
    url: '/admin/merchant/getSubjectInfo',
    params: { mchId },
  })
}

/**
 * 获取经营信息
 */
export const getBusinessInfo = (mchId: string) => {
  return defHttp.get<Result<BusinessForm>>({
    url: '/admin/merchant/getBusinessInfo',
    params: { mchId },
  })
}

export const getSettlementInfo = (mchId: string) => {
  return defHttp.get<Result<SettlementForm>>({
    url: '/admin/merchant/getSettlementInfo',
    params: { mchId },
  })
}

/**
 * 获取商户服务费率设置
 */
export const getFeeSettingInfo = (mchId: string) => {
  return defHttp.get<Result<FeeSettingForm>>({
    url: '/admin/merchant/getFeeSettingInfo',
    params: { mchId },
  })
}

/**
 * 保存商户服务费率设置
 */
export const saveFeeSettingInfo = (obj: FeeSettingForm) => {
  return defHttp.post<Result<void>>({
    url: '/admin/merchant/saveFeeSetting',
    data: obj,
  })
}
