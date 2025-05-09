// 天气服务，用于获取天气数据和处理位置信息

// 天气数据接口定义
interface WeatherItem {
    date: string;
    weather: string;
    temp: string;
    icon: string;
    iconUrl?: string;
}

interface CityCoordinates {
    latitude: number;
    longitude: number;
}

// 模拟的天气数据 - 按城市分组
const mockWeatherData = {
    "北京": [
        { date: '今天', weather: '晴', temp: '28°/18°', icon: 'sunny' },
        { date: '明天', weather: '多云', temp: '26°/17°', icon: 'cloudy' },
        { date: '周三', weather: '小雨', temp: '24°/16°', icon: 'light-rain' },
        { date: '周四', weather: '阴', temp: '25°/15°', icon: 'overcast' },
        { date: '周五', weather: '晴', temp: '27°/16°', icon: 'sunny' },
        { date: '周六', weather: '晴', temp: '29°/18°', icon: 'sunny' },
        { date: '周日', weather: '多云', temp: '28°/17°', icon: 'cloudy' }
    ],
    "上海": [
        { date: '今天', weather: '多云', temp: '26°/20°', icon: 'cloudy' },
        { date: '明天', weather: '小雨', temp: '25°/19°', icon: 'light-rain' },
        { date: '周三', weather: '中雨', temp: '23°/18°', icon: 'moderate-rain' },
        { date: '周四', weather: '小雨', temp: '24°/19°', icon: 'light-rain' },
        { date: '周五', weather: '多云', temp: '25°/20°', icon: 'cloudy' },
        { date: '周六', weather: '晴', temp: '27°/21°', icon: 'sunny' },
        { date: '周日', weather: '晴', temp: '28°/22°', icon: 'sunny' }
    ],
    "广州": [
        { date: '今天', weather: '雷阵雨', temp: '32°/25°', icon: 'thunderstorm' },
        { date: '明天', weather: '中雨', temp: '30°/24°', icon: 'moderate-rain' },
        { date: '周三', weather: '小雨', temp: '31°/25°', icon: 'light-rain' },
        { date: '周四', weather: '多云', temp: '33°/26°', icon: 'cloudy' },
        { date: '周五', weather: '晴', temp: '34°/27°', icon: 'sunny' },
        { date: '周六', weather: '晴', temp: '35°/27°', icon: 'sunny' },
        { date: '周日', weather: '多云', temp: '33°/26°', icon: 'cloudy' }
    ],
    "深圳": [
        { date: '今天', weather: '中雨', temp: '31°/25°', icon: 'moderate-rain' },
        { date: '明天', weather: '小雨', temp: '30°/24°', icon: 'light-rain' },
        { date: '周三', weather: '多云', temp: '32°/25°', icon: 'cloudy' },
        { date: '周四', weather: '晴', temp: '33°/26°', icon: 'sunny' },
        { date: '周五', weather: '晴', temp: '34°/27°', icon: 'sunny' },
        { date: '周六', weather: '多云', temp: '33°/26°', icon: 'cloudy' },
        { date: '周日', weather: '小雨', temp: '31°/25°', icon: 'light-rain' }
    ],
    // 添加更多城市数据
    "杭州": [
        { date: '今天', weather: '多云', temp: '27°/19°', icon: 'cloudy' },
        { date: '明天', weather: '小雨', temp: '25°/18°', icon: 'light-rain' },
        { date: '周三', weather: '中雨', temp: '24°/17°', icon: 'moderate-rain' },
        { date: '周四', weather: '小雨', temp: '25°/18°', icon: 'light-rain' },
        { date: '周五', weather: '多云', temp: '26°/19°', icon: 'cloudy' },
        { date: '周六', weather: '晴', temp: '28°/20°', icon: 'sunny' },
        { date: '周日', weather: '晴', temp: '29°/21°', icon: 'sunny' }
    ],
    "成都": [
        { date: '今天', weather: '多云', temp: '25°/17°', icon: 'cloudy' },
        { date: '明天', weather: '小雨', temp: '23°/16°', icon: 'light-rain' },
        { date: '周三', weather: '中雨', temp: '22°/15°', icon: 'moderate-rain' },
        { date: '周四', weather: '小雨', temp: '24°/16°', icon: 'light-rain' },
        { date: '周五', weather: '多云', temp: '25°/17°', icon: 'cloudy' },
        { date: '周六', weather: '晴', temp: '26°/18°', icon: 'sunny' },
        { date: '周日', weather: '晴', temp: '27°/19°', icon: 'sunny' }
    ],
    "南京": [
        { date: '今天', weather: '多云', temp: '26°/18°', icon: 'cloudy' },
        { date: '明天', weather: '小雨', temp: '24°/17°', icon: 'light-rain' },
        { date: '周三', weather: '中雨', temp: '23°/16°', icon: 'moderate-rain' },
        { date: '周四', weather: '小雨', temp: '25°/17°', icon: 'light-rain' },
        { date: '周五', weather: '多云', temp: '26°/18°', icon: 'cloudy' },
        { date: '周六', weather: '晴', temp: '27°/19°', icon: 'sunny' },
        { date: '周日', weather: '晴', temp: '28°/20°', icon: 'sunny' }
    ]
};

// 城市坐标映射（模拟数据）
const cityCoordinates: { [key: string]: { latitude: number, longitude: number } } = {
    '北京': { latitude: 39.9042, longitude: 116.4074 },
    '上海': { latitude: 31.2304, longitude: 121.4737 },
    '广州': { latitude: 23.1291, longitude: 113.2644 },
    '深圳': { latitude: 22.5431, longitude: 114.0579 },
    '杭州': { latitude: 30.2741, longitude: 120.1551 },
    '成都': { latitude: 30.5728, longitude: 104.0668 },
    '南京': { latitude: 32.0603, longitude: 118.7969 }
};

// 获取天气图标
const getWeatherIcon = (iconName: string): string => {
    const iconMap: { [key: string]: string } = {
        'sunny': '/assets/weather-icons/sunny.png',
        'cloudy': '/assets/weather-icons/cloudy.png',
        'overcast': '/assets/weather-icons/overcast.png',
        'light-rain': '/assets/weather-icons/light-rain.png',
        'moderate-rain': '/assets/weather-icons/moderate-rain.png',
        'heavy-rain': '/assets/weather-icons/heavy-rain.png',
        'thunderstorm': '/assets/weather-icons/thunderstorm.png',
        'snow': '/assets/weather-icons/snow.png',
        'fog': '/assets/weather-icons/fog.png'
    };

    return iconMap[iconName] || '/assets/weather-icons/cloudy.png';
};

// 获取天气数据
export const getWeatherData = (city: string) => {
    // 这里模拟API调用，实际项目中应该调用真实的天气API
    return new Promise((resolve) => {
        setTimeout(() => {
            // 如果没有该城市的数据，使用北京的数据作为默认值
            const data = mockWeatherData[city] || mockWeatherData['北京'];
            // 添加图标URL
            const weatherWithIcons = data.map(item => ({
                ...item,
                iconUrl: getWeatherIcon(item.icon)
            }));
            resolve(weatherWithIcons);
        }, 500); // 模拟网络延迟
    });
};

// 根据坐标获取最近的城市（模拟）
const getNearestCity = (latitude: number, longitude: number): string => {
    // 实际项目中应该使用逆地理编码API
    // 这里简单模拟：计算与已知城市坐标的距离，返回最近的城市
    let nearestCity = '北京';
    let minDistance = Number.MAX_VALUE;

    for (const city in cityCoordinates) {
        const cityCoord = cityCoordinates[city];
        // 计算距离（简化版，实际应使用球面距离公式）
        const distance = Math.sqrt(
            Math.pow(latitude - cityCoord.latitude, 2) +
            Math.pow(longitude - cityCoord.longitude, 2)
        );

        if (distance < minDistance) {
            minDistance = distance;
            nearestCity = city;
        }
    }

    return nearestCity;
};

// 获取当前位置
export const getCurrentLocation = () => {
    return new Promise<string>((resolve, reject) => {
        wx.getLocation({
            type: 'gcj02', // 使用国测局坐标系
            success: (res) => {
                const { latitude, longitude } = res;
                // 根据坐标获取城市名称
                const city = getNearestCity(latitude, longitude);
                // 保存当前城市
                saveCurrentCity(city);
                resolve(city);
            },
            fail: (err) => {
                console.error('获取位置失败', err);
                // 如果获取位置失败，尝试使用保存的城市
                const savedCity = getSavedCity();
                if (savedCity) {
                    resolve(savedCity);
                } else {
                    // 如果没有保存的城市，使用默认城市
                    resolve('北京');
                }
            }
        });
    });
};

// 保存当前城市
export const saveCurrentCity = (city: string) => {
    wx.setStorageSync('currentCity', city);

    // 更新最近使用的城市列表
    let recentCities = wx.getStorageSync('recentCities') || [];
    // 如果已存在，先移除
    recentCities = recentCities.filter((item: string) => item !== city);
    // 添加到列表开头
    recentCities.unshift(city);
    // 最多保存5个
    if (recentCities.length > 5) {
        recentCities = recentCities.slice(0, 5);
    }
    wx.setStorageSync('recentCities', recentCities);
};

// 获取保存的城市
export const getSavedCity = (): string => {
    return wx.getStorageSync('currentCity') || '北京';
};