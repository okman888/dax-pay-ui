/**
 * 支付通道
 */
export enum ChannelEnum {
  ALI = 'ali_pay',
  ALI_ISV = 'alipay_isv',
  WECHAT = 'wechat_pay',
  WECHAT_ISV = 'wechat_pay_isv',
  UNION_PAY = 'union_pay',
  LESHUA_PAY = 'leshua_pay',
  VBILL_PAY = 'vbill_pay',
  ADA_PAY = 'ada_pay',
  HKRT_PAY = 'hkrt_pay',
  DOUGONG_PAY = 'dougong_pay',
  LAKALA_PAY = 'lakala_pay',
  FUYOU_PAY = 'fuyou_pay',
  SHENG_PAY = 'sheng_pay',
  YSEP_PAY = 'ysep_pay',
  QUICK_PAY = 'quick_pay',
  SAND_PAY = 'sand_pay',
  YEE_PAY = 'yee_pay',
  UMS_PAY = 'ums_pay',
  CPCN_PAY = 'cpcn_pay',
}

/**
 * 支付方式
 */
export enum PayMethodEnum {
  /** wap支付 */
  WAP = 'wap',
  /** 应用支付 */
  APP = 'app',
  /** web支付 */
  WEB = 'web',
  /** 扫码支付 */
  QRCODE = 'qrcode',
  /** 付款码 */
  BARCODE = 'barcode',
  /** 小程序支付 */
  JSAPI = 'jsapi',
  /** 其他支付 */
  OTHER = 'other',
}

/**
 * 交易类型
 */
export enum TradeTypeEnum {
  /**
   * 支付
   */
  PAY = 'pay',
  /**
   * 退款
   */
  REFUND = 'refund',
  /**
   * 转账
   */
  TRANSFER = 'transfer',
}

/**
 * 客户通知内容类型
 */
export enum NotifyContentTypeEnum {
  /** 支付订单变动通知 */
  PAY = 'pay',

  /** 退款订单变动通知 */
  REFUND = 'refund',

  /** 支付订单变动通知 */
  TRANSFER = 'transfer',
}

/**
 * 通道认证状态
 */
export enum ChannelAuthStatusEnum {
  /** 获取中 */
  WAITING = 'waiting',
  /** 获取成功 */
  SUCCESS = 'success',
  /** 数据不存在 */
  NOT_EXIST = 'not_exist',
}

/**
 * 收银场景
 */
export enum CashierSceneEnum {
  WECHAT_PAY = 'wechat_pay',
  ALIPAY = 'alipay',
  UNION_PAY = 'union_pay',
}

/**
 * 服务商状态枚举
 */
export enum IsvStatusEnum {
  /** 停用 */
  DISABLED = 'disabled',
  /** 启用 */
  ENABLED = 'enable',
}

/**
 * 商户状态枚举
 */
export enum MerchantStatusEnum {
  /** 禁用 */
  DISABLED = 'disabled',
  /** 启用 */
  ENABLED = 'enable',
}

/**
 * 进件申请状态
 */
export enum OnbApplyStatusEnum {
  /** 草稿 */
  DRAFT = 'draft',
  /** 预审 */
  PRE_TRIAL = 'pre_trial',
  /** 预审拒绝 */
  PRE_TRIAL_REJECT = 'pre_trial_reject',
  /** 数据补填 */
  COMPLETION = 'completion',
  /** 申请中 */
  APPLY = 'apply',
  /** 驳回 */
  REJECT = 'reject',
  /** 待签署 */
  SIGN = 'sign',
  /** 开通中 */
  OPENING = 'opening',
  /** 通过 */
  PASS = 'pass',
  /** 已生成进件商户 */
  GENERATED = 'generated',
  /** 关闭 */
  CLOSED = 'closed',
  /** 错误 */
  ERROR = 'error',
}
