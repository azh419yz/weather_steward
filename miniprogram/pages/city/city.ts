// 城市选择页面
import { saveCurrentCity } from '../../services/weather';

// 省份和城市数据
const provinces = [
    {
        value: '北京',
        label: '北京',
        children: [{ value: '北京', label: '北京' }]
    },
    {
        value: '上海',
        label: '上海',
        children: [{ value: '上海', label: '上海' }]
    },
    {
        value: '广东',
        label: '广东',
        children: [
            { value: '广州', label: '广州' },
            { value: '深圳', label: '深圳' },
            { value: '珠海', label: '珠海' },
            { value: '汕头', label: '汕头' },
            { value: '佛山', label: '佛山' },
            { value: '东莞', label: '东莞' },
            { value: '中山', label: '中山' }
        ]
    },
    {
        value: '江苏',
        label: '江苏',
        children: [
            { value: '南京', label: '南京' },
            { value: '苏州', label: '苏州' },
            { value: '无锡', label: '无锡' },
            { value: '常州', label: '常州' },
            { value: '镇江', label: '镇江' },
            { value: '南通', label: '南通' },
            { value: '扬州', label: '扬州' }
        ]
    },
    {
        value: '浙江',
        label: '浙江',
        children: [
            { value: '杭州', label: '杭州' },
            { value: '宁波', label: '宁波' },
            { value: '温州', label: '温州' },
            { value: '嘉兴', label: '嘉兴' },
            { value: '湖州', label: '湖州' },
            { value: '绍兴', label: '绍兴' },
            { value: '金华', label: '金华' }
        ]
    },
    {
        value: '四川',
        label: '四川',
        children: [
            { value: '成都', label: '成都' },
            { value: '自贡', label: '自贡' },
            { value: '攀枝花', label: '攀枝花' },
            { value: '泸州', label: '泸州' },
            { value: '德阳', label: '德阳' },
            { value: '绵阳', label: '绵阳' },
            { value: '广元', label: '广元' }
        ]
    }
];

Component({
    data: {
        provinces: provinces,
        visible: false,
        selectedCity: '',
        selectedProvince: '',
        recentCities: [] as string[]
    },
    lifetimes: {
        attached() {
            // 获取最近选择的城市列表
            const recentCities = wx.getStorageSync('recentCities') || [];
            this.setData({ recentCities });

            // 获取当前选择的城市
            const currentCity = wx.getStorageSync('currentCity');
            if (currentCity) {
                this.setData({ selectedCity: currentCity });
            }
        }
    },
    methods: {
        // 打开城市选择器
        openCascader() {
            this.setData({
                visible: true
            });
        },
        // 关闭城市选择器
        closeCascader() {
            this.setData({
                visible: false
            });
        },
        // 选择城市后的回调
        onCityChange(e: any) {
            const { selectedOption } = e.detail;
            // 获取省份和城市
            const province = selectedOption[0].value;
            const city = selectedOption[selectedOption.length - 1].value;

            this.setData({
                selectedProvince: province,
                selectedCity: city,
                visible: false
            });

            // 保存选择的城市并更新最近选择的城市列表
            this.saveCity(city);
        },

        // 保存城市并返回首页
        saveCity(city: string) {
            // 保存当前选择的城市
            saveCurrentCity(city);

            // 更新最近选择的城市列表
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

            // 返回首页并刷新天气数据
            wx.navigateBack({
                success: () => {
                    // 通知首页刷新数据
                    const pages = getCurrentPages();
                    if (pages.length > 1) {
                        const prevPage = pages[pages.length - 2];
                        prevPage.refreshWeather && prevPage.refreshWeather(city);
                    }
                }
            });
        },

        // 选择最近使用的城市
        selectRecentCity(e: any) {
            const { city } = e.currentTarget.dataset;
            this.setData({ selectedCity: city });
            this.saveCity(city);
        },

        // 返回首页
        goBack() {
            wx.navigateBack();
        }
    }
});