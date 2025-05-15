/**
 * 天气服务 - 提供天气数据相关的API调用
 */

// 天气类型枚举
export enum WeatherType {
  Sunny = '晴天',
  Cloudy = '多云',
  Overcast = '阴天',
  LightRain = '小雨',
  ModerateRain = '中雨',
  HeavyRain = '大雨',
  Thunderstorm = '雷阵雨',
  Foggy = '雾',
  Snowy = '雪'
}

// 城市数据接口
export interface CityData {
  provinceCode: string;  // 省份代码
  cityCode: string;      // 城市代码
  districtCode: string;  // 区县代码
  provinceName: string;  // 省份名称
  cityName: string;      // 城市名称
  districtName: string;  // 区县名称
}

// 省份数据接口
export interface ProvinceData {
  code: string;
  name: string;
}

// 城市数据接口
export interface CityDataItem {
  code: string;
  name: string;
}

// 区县数据接口
export interface DistrictData {
  id: string;
  code: string;  // 添加code字段
  name: string;
  longitude: number;
  latitude: number;
}

// 所在地名称接口
export interface LocationNameData {
  city: string;
  district: string;
  province: string;
}

// 更新所在地接口
export interface UpdateLocationParams {
  openid: string;
  country: string;
  province: string;
  city: string;
  district: string;
}

// 新的天气数据类型
export interface NewWeatherData {
  date: string;
  high: number;
  low: number;
  text_day: string;
  text_night: string;
  wc_day: string;
  wc_night: string;
  wd_day: string;
  wd_night: string;
  week: string;
}

// 获取省份列表
export const getProvinces = (): Promise<ProvinceData[]> => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://127.0.0.1:5000/api/weather/area/provinces',
      method: 'GET',
      success: (res) => {
        resolve(res.data as ProvinceData[]);
      },
      fail: (error) => {
        console.error('获取省份列表失败:', error);
        reject(error);
      }
    });
  });
};

// 获取城市列表
export const getCities = (provinceName: string): Promise<CityDataItem[]> => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://127.0.0.1:5000/api/weather/area/cities',
      method: 'GET',
      data: { province: provinceName },
      success: (res) => {
        resolve(res.data as CityDataItem[]);
      },
      fail: (error) => {
        console.error('获取城市列表失败:', error);
        reject(error);
      }
    });
  });
};

// 获取区县列表
export const getDistricts = (cityCode: string): Promise<DistrictData[]> => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://127.0.0.1:5000/api/weather/area/districts',
      method: 'GET',
      data: { city_geocode: cityCode },
      success: (res) => {
        resolve(res.data as DistrictData[]);
      },
      fail: (error) => {
        console.error('获取区县列表失败:', error);
        reject(error);
      }
    });
  });
};

/**
 * 检查位置权限
 * @returns Promise<boolean> 是否有位置权限
 */
export const checkLocationPermission = (): Promise<boolean> => {
  return new Promise((resolve) => {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation']) {
          resolve(true);
        } else {
          // 如果没有权限，尝试获取权限
          wx.authorize({
            scope: 'scope.userLocation',
            success: () => resolve(true),
            fail: () => resolve(false)
          });
        }
      },
      fail: () => resolve(false)
    });
  });
};

/**
 * 根据天气类型获取天气提示信息
 * @param weatherType 天气类型
 * @returns string 天气提示信息
 */
export const getWeatherTips = (weatherType: WeatherType): string => {
  switch (weatherType) {
    case WeatherType.Sunny:
      return '注意防晒，多补充水分，适合户外活动。';
    case WeatherType.Cloudy:
      return '天气舒适，适合户外活动，建议携带薄外套。';
    case WeatherType.Overcast:
      return '光线较弱，不太适合拍照，建议携带外套。';
    case WeatherType.LightRain:
      return '带好雨具，穿防滑鞋子，出行注意安全。';
    case WeatherType.ModerateRain:
      return '雨量较大，尽量减少外出，必要时带好雨具。';
    case WeatherType.HeavyRain:
      return '雨势较大，尽量避免外出，注意防范积水和交通安全。';
    case WeatherType.Thunderstorm:
      return '雷电天气，请勿在空旷地带停留，远离大树和金属物体。';
    case WeatherType.Foggy:
      return '能见度低，开车注意减速慢行，打开雾灯。';
    case WeatherType.Snowy:
      return '道路湿滑，注意保暖，出行注意安全。';
    default:
      return '随时关注天气变化，适当调整出行计划。';
  }
};

/**
 * 获取当前位置信息
 * @returns Promise<CityData> 位置信息
 */
export const getCurrentLocation = (): Promise<CityData> => {
  return new Promise((resolve, reject) => {
    try {
      const app = getApp<IAppOption>();
      const { province, city, district } = app.globalData;

      if (!province || !city || !district) {
        reject(new Error('位置信息未初始化'));
        return;
      }

      resolve({
        provinceCode: province,
        cityCode: city,
        districtCode: district,
        provinceName: '',  // 这些名称信息暂时不需要，因为只使用了编码
        cityName: '',
        districtName: ''
      });
    } catch (error) {
      reject(error);
    }
  });
};

// 获取所在地名称
export const getLocationName = (city: string, district: string): Promise<LocationNameData> => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://127.0.0.1:5000/api/weather/area/location_name',
      method: 'GET',
      data: { city, district },
      success: (res) => {
        resolve(res.data as LocationNameData);
      },
      fail: (error) => {
        console.error('获取所在地名称失败:', error);
        reject(error);
      }
    });
  });
};

// 更新位置信息
export const updateLocationInfo = (params: UpdateLocationParams): Promise<void> => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://127.0.0.1:5000/api/weather/location',
      method: 'POST',
      data: params,
      success: () => {
        resolve();
      },
      fail: (error) => {
        console.error('更新位置信息失败:', error);
        reject(error);
      }
    });
  });
};

// 获取天气列表（按区县）
export const getWeatherByDistrict = (district: string): Promise<NewWeatherData[]> => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://127.0.0.1:5000/api/weather/weather',
      method: 'GET',
      data: { district },
      success: (res) => {
        resolve(res.data as NewWeatherData[]);
      },
      fail: (error) => {
        console.error('获取天气失败:', error);
        reject(error);
      }
    });
  });
};