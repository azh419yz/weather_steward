/// <reference path="./types/wx/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo,
    openid?: string,
    country?: string,
    province?: string,
    city?: string,
    district?: string
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
} 