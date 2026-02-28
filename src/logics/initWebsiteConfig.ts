import { getWebsite } from '@/views/daxpay/admin/config/platform/PlatformConfig.api'
import { isAdmin } from '@/utils/env'
import { ref } from 'vue'

export const WEBSITE_CONFIG = ref<WebsiteConfig>({})

/**
 * 初始化网站配置, 并且挂到全局
 */
export function initWebsiteConfig() {
  // 先从缓存中读取
  const websiteConfig = localStorage.getItem('websiteConfig')
  if (websiteConfig) {
    WEBSITE_CONFIG.value = JSON.parse(websiteConfig)
    const favicon = document.getElementById('favicon')
    if (favicon) {
      console.log(123)
      // @ts-ignore 动态更新 favicon
      favicon.href = getFavicon()
    }
  }
  // 然后更新配置
  getWebsite().then((res) => {
    WEBSITE_CONFIG.value = res.data
    localStorage.setItem('websiteConfig', JSON.stringify(res.data))
    // @ts-ignore 动态更新 favicon
    const favicon = document.getElementById('favicon')
    if (favicon) {
      // @ts-ignore 动态更新 favicon
      favicon.href = getFavicon()
    }
  })
}

/**
 * 获取系统标题
 */
export function getSystemTitle() {
  const title = WEBSITE_CONFIG.value?.systemName || ''
  if (isAdmin()) {
    return title + '运营端'
  } else {
    return title + '商户端'
  }
}

/**
 * 获取系统名称
 */
export function getSystemName() {
  return WEBSITE_CONFIG.value?.systemName || ''
}

/**
 * 获取系统logo
 */
export function getSystemLogo() {
  const wholeLogo = WEBSITE_CONFIG.value.wholeLogo
  if (wholeLogo) {
    return `${import.meta.env.VITE_GLOB_API_URL}/file/download/${wholeLogo}`
  } else {
    return '/logo.png'
  }
}

/**
 * 获取favicon
 */
export function getFavicon() {
  const wholeLogo = WEBSITE_CONFIG.value.wholeLogo
  if (wholeLogo) {
    return `${import.meta.env.VITE_GLOB_API_URL}/file/download/${wholeLogo}?t=${Date.now()}`
  } else {
    return '/favicon.ico'
  }
}

/**
 * 获取公司全称
 */
export function getCompanyName() {
  return WEBSITE_CONFIG.value.companyName || ''
}

/**
 * 获取公司电话
 */
export function getCompanyPhone() {
  return WEBSITE_CONFIG.value.companyPhone || ''
}

/**
 * 获取公司邮箱
 */
export function getCompanyEmail() {
  return WEBSITE_CONFIG.value.companyEmail || ''
}

/**
 * 获取工信部ICP备案信息
 */
export function getIcpInfo() {
  return WEBSITE_CONFIG.value.icpInfo || ''
}

/**
 * 获取工信部ICP链接
 */
export function getIcpLink() {
  return WEBSITE_CONFIG.value.icpLink || ''
}

/**
 * 获取公网安备案信息
 */
export function getMpsInfo() {
  return WEBSITE_CONFIG.value.mpsInfo || ''
}

/**
 * 获取公网安备案链接
 */
export function getMpsLink() {
  return WEBSITE_CONFIG.value.mpsLink || ''
}

/**
 * 获取中国支付清算协会备案信息
 */
export function getPcacInfo() {
  return WEBSITE_CONFIG.value.pcacInfo || ''
}

/**
 * 获取中国支付清算协会备案链接
 */
export function getPcacLink() {
  return WEBSITE_CONFIG.value.pcacLink || ''
}

/**
 * 获取电信增值业务许可信息
 */
export function getIcpPlusInfo() {
  return WEBSITE_CONFIG.value.icpPlusInfo || ''
}

/**
 * 获取电信增值业务许可链接
 */
export function getIcpPlusLink() {
  return WEBSITE_CONFIG.value.icpPlusLink || ''
}

/**
 * 获取版权信息
 */
export function getCopyright() {
  return WEBSITE_CONFIG.value.copyright || ''
}

/**
 * 获取版权信息链接
 */
export function getCopyrightLink() {
  return WEBSITE_CONFIG.value.copyrightLink || ''
}

/**
 * 站点显示内容配置
 * @author xxm
 * @since 2025/6/29
 */
export interface WebsiteConfig {
  /** 系统名称 */
  systemName?: string
  /** 公司全称 */
  companyName?: string
  /** 公司电话 */
  companyPhone?: string
  /** 公司邮箱 */
  companyEmail?: string
  /** 系统完整logo */
  wholeLogo?: string
  /** 系统简化Logo */
  simpleLogo?: string
  /** 工信部ICP备案信息 */
  icpInfo?: string
  /** 工信部ICP链接地址 */
  icpLink?: string
  /** 公网安备案信息 */
  mpsInfo?: string
  /** 公网安备案链接地址 */
  mpsLink?: string
  /** 中国支付清算协会备案信息 */
  pcacInfo?: string
  /** 中国支付清算协会备案链接地址 */
  pcacLink?: string
  /** 电信增值业务许可信息 */
  icpPlusInfo?: string
  /** 电信增值业务许可链接地址 */
  icpPlusLink?: string
  /** 版权信息 */
  copyright?: string
  /** 版权信息链接 */
  copyrightLink?: string
}
