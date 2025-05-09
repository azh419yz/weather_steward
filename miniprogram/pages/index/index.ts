// index.ts
// 获取应用实例
const app = getApp<IAppOption>()
import { getCurrentLocation, getWeatherData, getSavedCity } from '../../services/weather';
import { formatTime } from '../../utils/util';

interface PageData {
  currentCity: string;
  weatherData: Array<{
    date: string;
    weather: string;
    temp: string;
    icon: string;
    iconUrl?: string;
  }>;
  loading: boolean;
  hasLocationAuth: boolean;
  refreshing: boolean;
  updateTime: string;
}

Component({
  data: {
    currentCity: '正在定位...',
    weatherData: [],
    loading: true,
    hasLocationAuth: false,
    refreshing: false,
    updateTime: ''
  },
  lifetimes: {
    attached() {
      // 页面加载时获取位置和天气数据
      this.initLocation();
    }
  },
  methods: {
    // 初始化位置信息
    async initLocation() {
      try {
        // 先尝试获取保存的城市
        const savedCity = getSavedCity();
        if (savedCity) {
          this.setData({ currentCity: savedCity });
          this.fetchWeatherData(savedCity);
        }

        // 请求位置授权
        wx.getSetting({
          success: (res) => {
            if (res.authSetting['scope.userLocation']) {
              this.setData({ hasLocationAuth: true });
              // 已授权，获取位置
              this.getLocation();
            } else {
              // 未授权，显示授权按钮
              this.setData({ hasLocationAuth: false });
            }
          }
        });
      } catch (error) {
        console.error('初始化位置失败', error);
        wx.showToast({
          title: '获取位置信息失败',
          icon: 'none'
        });
      }
    },

    // 获取位置
    async getLocation() {
      try {
        const city = await getCurrentLocation();
        this.setData({
          currentCity: city,
          hasLocationAuth: true
        });
        this.fetchWeatherData(city);
      } catch (error) {
        console.error('获取位置失败', error);
        wx.showToast({
          title: '获取位置失败',
          icon: 'none'
        });
      }
    },

    // 请求位置授权
    requestLocationAuth() {
      wx.authorize({
        scope: 'scope.userLocation',
        success: () => {
          this.setData({ hasLocationAuth: true });
          this.getLocation();
        },
        fail: () => {
          wx.showModal({
            title: '提示',
            content: '需要您的位置权限才能获取天气信息',
            confirmText: '去设置',
            success: (res) => {
              if (res.confirm) {
                wx.openSetting();
              }
            }
          });
        }
      });
    },

    // 下拉刷新触发
    onPulling() {
      console.log('下拉刷新触发');
    },

    // 下拉刷新
    onRefresh() {
      this.setData({ refreshing: true });
      this.getLocation();
    },

    // 获取天气数据
    async fetchWeatherData(city: string) {
      this.setData({ loading: true });
      try {
        const weatherData = await getWeatherData(city);
        // 更新时间
        const now = new Date();
        const updateTime = formatTime(now).split(' ')[1]; // 只取时间部分

        this.setData({
          weatherData,
          loading: false,
          refreshing: false,
          updateTime
        });
      } catch (error) {
        console.error('获取天气数据失败', error);
        this.setData({
          loading: false,
          refreshing: false
        });
        wx.showToast({
          title: '获取天气数据失败',
          icon: 'none'
        });
      }
    },

    // 打开城市选择页面
    openCitySelector() {
      wx.navigateTo({
        url: '../city/city'
      });
    },

    // 下拉刷新
    onPullDownRefresh() {
      this.setData({ refreshing: true });
      this.fetchWeatherData(this.data.currentCity);
      wx.stopPullDownRefresh();
    },

    // 供城市选择页面调用的刷新方法
    refreshWeather(city: string) {
      this.setData({ currentCity: city });
      this.fetchWeatherData(city);
    }
  },
})