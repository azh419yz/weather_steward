// app.ts
interface LoginResponse {
  openid: string;
  country: string;
  province: string,
  city: string;
  district: string;
}

interface LocationResponse {
  country: string;
  province: string,
  city: string;
  district: string;
}

App<IAppOption>({
  globalData: {
    userInfo: undefined,
    openid: '',
    country: '',
    province: '',
    city: '',
    district: ''
  },
  onLaunch() {
    // 1. 登录获取 openId
    wx.login({
      success: res => {
        // 这里用 res.code 换 openId
        wx.request({
          url: 'http://127.0.0.1:5000/api/weather/login',
          method: 'GET',
          data: { code: res.code },
          success: (openidRes) => {
            const { openid, country, province, city, district } = openidRes.data as LoginResponse;
            this.globalData.openid = openid;
            if (country && province && city && district) {
              // 如果已经有城市信息，直接保存并跳转
              this.globalData.country = country;
              this.globalData.province = province;
              this.globalData.city = city;
              this.globalData.district = district;
              wx.reLaunch({
                url: '/pages/index/index'
              });
            } else {
              // 2. 提示用户授权地理位置
              wx.getSetting({
                success: settingRes => {
                  if (!settingRes.authSetting['scope.userLocation']) {
                    wx.authorize({
                      scope: 'scope.userLocation',
                      success: () => {
                        // 3. 获取地理位置,更新用户信息
                        wx.getLocation({
                          type: 'gcj02',
                          success: locRes => {
                            wx.request({
                              url: 'http://127.0.0.1:5000/api/weather/location',
                              method: 'GET',
                              data: { openid: openid, lat: locRes.latitude, lng: locRes.longitude },
                              success: (locationRes) => {
                                console.log(locationRes);
                                const { country, province, city, district } = locationRes.data as LocationResponse;
                                // 存到全局参数
                                this.globalData.country = country;
                                this.globalData.province = province;
                                this.globalData.city = city;
                                this.globalData.district = district;
                                // 跳转到首页
                                wx.reLaunch({
                                  url: '/pages/index/index'
                                });
                              }
                            });
                          }
                        });
                      },
                      fail: () => {
                        // 用户拒绝授权，跳转首页，默认北京
                        this.globalData.country = '0';
                        this.globalData.province = '110100';
                        this.globalData.city = '110100';
                        this.globalData.district = '110100';
                        wx.reLaunch({
                          url: '/pages/index/index'
                        });
                      }
                    });
                  } else {
                    // 已授权，直接获取位置
                    wx.getLocation({
                      type: 'gcj02',
                      success: locRes => {
                        wx.request({
                          url: 'http://127.0.0.1:5000/api/weather/location',
                          method: 'GET',
                          data: { openid: openid, lat: locRes.latitude, lng: locRes.longitude },
                          success: (locationRes) => {
                            console.log(locationRes);
                            const { country, province, city, district } = locationRes.data as LocationResponse;
                            // 存到全局参数
                            this.globalData.country = country;
                            this.globalData.province = province;
                            this.globalData.city = city;
                            this.globalData.district = district;
                            // 跳转到首页
                            wx.reLaunch({
                              url: '/pages/index/index'
                            });
                          }
                        });
                      }
                    });
                  }
                }
              });
            }
          }
        });
      }
    });
  },
});