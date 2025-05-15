/// <reference path="./wx/index.d.ts" />

declare namespace WechatMiniprogram {
  interface UserInfo {
    nickName: string
    avatarUrl: string
    gender: number
    country: string
    province: string
    city: string
    language: string
  }

  interface GetUserInfoSuccessCallback {
    (res: {
      userInfo: UserInfo
      rawData: string
      signature: string
      encryptedData: string
      iv: string
    }): void
  }

  interface GetUserInfoOptions {
    withCredentials?: boolean
    lang?: string
    success?: GetUserInfoSuccessCallback
    fail?: (res: any) => void
    complete?: (res: any) => void
  }

  interface Wx {
    getUserInfo(options: GetUserInfoOptions): void
    login(options: {
      success?: (res: { code: string }) => void
      fail?: (res: any) => void
      complete?: (res: any) => void
    }): void
    getStorageSync(key: string): any
    setStorageSync(key: string, data: any): void
    showToast(options: {
      title: string
      icon?: 'success' | 'error' | 'loading' | 'none'
      duration?: number
      mask?: boolean
      success?: (res: any) => void
      fail?: (res: any) => void
      complete?: (res: any) => void
    }): void
    navigateTo(options: {
      url: string
      success?: (res: any) => void
      fail?: (res: any) => void
      complete?: (res: any) => void
    }): void
  }
}

declare const wx: WechatMiniprogram.Wx
declare function getApp<T>(): T 