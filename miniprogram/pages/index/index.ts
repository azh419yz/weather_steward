// index.ts
// 导入服务
import { formatTime } from '../../utils/util';
import {
  getProvinces,
  getCities,
  getDistricts,
  getLocationName,
  LocationNameData,
  updateLocationInfo,
  getWeatherByDistrict,
  NewWeatherData
} from '../../services/weatherService';
import {
  subscribe,
  updateLocation
} from '../../services/appService';

// 获取应用实例
const app = getApp<IAppOption>();

Component({
  data: {
    // 位置信息
    currentLocation: {
      provinceCode: app.globalData.province || '',
      cityCode: app.globalData.city || '',
      districtCode: app.globalData.district || '',
      provinceName: '',
      cityName: '',
      districtName: ''
    },
    // 所在地名称
    locationName: {
      province: '',
      city: '',
      district: ''
    } as LocationNameData,
    // 天气数据
    weatherData: [] as NewWeatherData[],
    // 当前日期时间
    currentDate: '',
    // 加载状态
    loading: true,
    // 城市选择器相关
    showCityPicker: false,
    provinces: [] as Array<{code: string, name: string}>,
    citiesOfProvince: [] as Array<{code: string, name: string}>,
    districts: [] as Array<{id: string, code: string, name: string, longitude: number, latitude: number}>,
    selectedProvince: '',
    selectedProvinceCode: '',
    selectedCity: '',
    selectedCityCode: '',
    selectedDistrict: '',
    selectedDistrictCode: '',
    currentCity: '',
    currentTime: '',
    error: '',
  },
  lifetimes: {
    // 组件生命周期函数-在组件实例进入页面节点树时执行
    attached() {
      // 初始化应用
      this.initApp();
      
      // 更新当前时间
      this.updateCurrentTime();
      // 每分钟更新一次时间
      setInterval(() => {
        this.updateCurrentTime();
      }, 60000);
      
      // 订阅全局状态变化
      subscribe((newState) => {
        this.setData({
          currentLocation: newState.currentLocation || {
            provinceCode: app.globalData.province || '',
            cityCode: app.globalData.city || '',
            districtCode: app.globalData.district || '',
            provinceName: '',
            cityName: '',
            districtName: ''
          },
          weatherData: newState.weatherData,
          loading: newState.loading
        });
      });
    },
  },
  methods: {
    // 初始化天气应用
    async initApp() {
      try {
        this.setData({ loading: true, error: '' });
        // 从 globalData 获取位置信息
        const { province, city, district } = app.globalData;
        if (!province || !city || !district) {
          // 数据没准备好，保持 loading 状态，等待后续流程
          return;
        }
        // 获取所在地名称
        const locationName = await getLocationName(city, district);
        this.setData({ locationName });
        // 获取天气数据（新接口）
        const weatherData = await getWeatherByDistrict(district);
        this.setData({
          weatherData,
          loading: false
        });
      } catch (error) {
        console.error('初始化失败:', error);
        this.setData({
          loading: false,
          error: error instanceof Error ? error.message : '获取天气信息失败'
        });
      }
    },

    // 更新当前时间
    updateCurrentTime() {
      const now = new Date();
      const dateStr = formatTime(now).split(' ')[0]; // 只取日期部分
      const timeStr = now.toLocaleTimeString('zh-CN', { hour12: false });
      this.setData({
        currentDate: `${dateStr} ${timeStr}`,
        currentTime: now.toLocaleTimeString('zh-CN', { hour12: false })
      });
    },

    // 打开城市选择器
    async openCityPicker() {
      try {
        this.setData({ loading: true });
        // 获取省份列表
        const provinces = await getProvinces();
        
        // 从 globalData 获取当前位置信息
        const { province, city, district } = app.globalData;
        
        // 查找当前省份在列表中的索引
        const currentProvinceIndex = provinces.findIndex(p => p.code === province);
        const selectedProvince = currentProvinceIndex >= 0 ? provinces[currentProvinceIndex] : provinces[0];
        
        this.setData({
          showCityPicker: true,
          provinces,
          selectedProvince: selectedProvince.name,
          selectedProvinceCode: selectedProvince.code,
          loading: false
        });

        // 加载当前省份的城市列表
        await this.loadCities(selectedProvince.name);
        
        // 如果已有选中的城市，加载对应的区县列表
        if (city) {
          // 查找当前城市在列表中的索引
          const currentCityIndex = this.data.citiesOfProvince.findIndex(c => c.code === city);
          if (currentCityIndex >= 0) {
            const selectedCity = this.data.citiesOfProvince[currentCityIndex];
            this.setData({
              selectedCity: selectedCity.name,
              selectedCityCode: selectedCity.code
            });
            await this.loadDistricts(city);
            
            // 如果已有选中的区县，设置选中状态
            if (district) {
              const currentDistrictIndex = this.data.districts.findIndex(d => d.code === district);
              if (currentDistrictIndex >= 0) {
                const selectedDistrict = this.data.districts[currentDistrictIndex];
                this.setData({
                  selectedDistrict: selectedDistrict.name,
                  selectedDistrictCode: selectedDistrict.code
                });
              }
            }
          }
        }
      } catch (error) {
        console.error('打开城市选择器失败:', error);
        this.setData({
          loading: false,
          error: '获取省份列表失败'
        });
      }
    },

    // 关闭城市选择器
    closeCityPicker() {
      this.setData({
        showCityPicker: false,
        selectedProvince: '',
        selectedProvinceCode: '',
        selectedCity: '',
        selectedCityCode: '',
        selectedDistrict: '',
        selectedDistrictCode: '',
        citiesOfProvince: [],
        districts: []
      });
    },

    // 选择省份
    async selectProvince(e: any) {
      const province = e.currentTarget.dataset.province;
      const provinceCode = e.currentTarget.dataset.code;
      this.setData({
        selectedProvince: province,
        selectedProvinceCode: provinceCode,
        selectedCity: '',
        selectedCityCode: '',
        selectedDistrict: '',
        selectedDistrictCode: '',
        districts: []
      });
      await this.loadCities(province);
    },

    // 加载城市列表
    async loadCities(provinceName: string) {
      try {
        this.setData({ loading: true });
        const cities = await getCities(provinceName);
        this.setData({
          citiesOfProvince: cities,
          loading: false
        });
      } catch (error) {
        console.error('加载城市列表失败:', error);
        this.setData({
          loading: false,
          error: '获取城市列表失败'
        });
      }
    },

    // 选择城市
    async selectCity(e: any) {
      const city = e.currentTarget.dataset.city;
      const cityCode = e.currentTarget.dataset.code;
      this.setData({
        selectedCity: city,
        selectedCityCode: cityCode,
        selectedDistrict: '',
        selectedDistrictCode: ''
      });
      await this.loadDistricts(cityCode);
    },

    // 加载区县列表
    async loadDistricts(cityCode: string) {
      try {
        this.setData({ loading: true });
        const districts = await getDistricts(cityCode);
        this.setData({
          districts,
          loading: false
        });
      } catch (error) {
        console.error('加载区县列表失败:', error);
        this.setData({
          loading: false,
          error: '获取区县列表失败'
        });
      }
    },

    // 选择区县
    async selectDistrict(e: any) {
      const district = e.currentTarget.dataset.district;
      const districtCode = e.currentTarget.dataset.code;
      this.setData({
        selectedDistrict: district,
        selectedDistrictCode: districtCode
      });
    },

    // 确认城市选择
    async confirmCitySelection() {
      try {
        this.setData({ loading: true });
        
        // 从 globalData 获取 openid 和 country
        const { openid, country } = app.globalData;
        
        // 检查是否选择了省份和城市
        if (!this.data.selectedProvinceCode || !this.data.selectedCityCode) {
          wx.showToast({
            title: '请选择省份和城市',
            icon: 'none'
          });
          this.setData({ loading: false });
          return;
        }

        // 检查 openid 和 country 是否存在
        if (!openid || !country) {
          wx.showToast({
            title: '用户信息不完整',
            icon: 'none'
          });
          this.setData({ loading: false });
          return;
        }
        
        // 更新位置信息
        const newLocation = {
          provinceCode: this.data.selectedProvinceCode,
          cityCode: this.data.selectedCityCode,
          districtCode: this.data.selectedDistrictCode || '',
          provinceName: this.data.selectedProvince,
          cityName: this.data.selectedCity,
          districtName: this.data.selectedDistrict || ''
        };

        // 调用更新位置接口
        await updateLocationInfo({
          openid,
          country,
          province: this.data.selectedProvinceCode,
          city: this.data.selectedCityCode,
          district: this.data.selectedDistrictCode || ''
        });

        // 获取新的所在地名称
        const locationName = await getLocationName(this.data.selectedCityCode, this.data.selectedDistrictCode || '');
        this.setData({ locationName });

        // 更新全局状态
        await updateLocation(newLocation);

        // 更新 globalData，保证下次选择器打开是最新地区
        app.globalData.province = this.data.selectedProvinceCode;
        app.globalData.city = this.data.selectedCityCode;
        app.globalData.district = this.data.selectedDistrictCode || '';

        // 重新获取天气数据
        const weatherData = await getWeatherByDistrict(app.globalData.district);
        this.setData({ weatherData });

        // 关闭选择器
        this.closeCityPicker();
        
        wx.showToast({
          title: '城市切换成功',
          icon: 'success'
        });
      } catch (error) {
        console.error('确认城市选择失败:', error);
        this.setData({
          loading: false,
          error: '更新位置信息失败'
        });
        wx.showToast({
          title: '切换城市失败',
          icon: 'none'
        });
      }
    }
  },
})
