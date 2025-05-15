# 天气管家小程序

## 功能说明

### 1. 首页展示
- 顶部显示当前区县名称和"切换城市"按钮。
- 下方展示当前区县的5天天气卡片，包括日期、星期、日间天气、最高温、最低温、风向风力等。
- 页面进入时会自动加载当前区县的天气信息。
- 页面加载中时显示 loading，接口异常时显示错误提示。

### 2. 地区切换
- 点击"切换城市"按钮弹出省市区三级选择器。
- 选择省、市、区后，点击确定会：
  - 调用后端接口保存新地区信息。
  - 更新全局 globalData 的省市区。
  - 重新获取并展示新地区的天气信息。
- 选择器会自动滚动并高亮当前选中的省市区。

### 3. 天气获取
- 天气数据通过 `/weather/weather` 接口获取，参数为当前区县 code。
- 接口返回5天的天气列表，每天包含：
  - `date`：日期
  - `week`：星期
  - `high`：最高温度
  - `low`：最低温度
  - `text_day`：日间天气
  - `text_night`：夜间天气
  - `wc_day`：日间风力
  - `wc_night`：夜间风力
  - `wd_day`：日间风向
  - `wd_night`：夜间风向

### 4. 数据结构
- 地区数据：
  - 省/市/区均为 `{ code, name }` 结构。
- 天气数据：
  - 见上文"天气获取"接口返回格式。

### 5. 主要接口
- `/weather/login` 登录，获取用户所在地
- `/weather/location` 逆地理编码，用户第一次登录时通过经纬度获取用户所在地（GET，参数：openid, lat, lng）
- `/weather/location` 保存用户选择的地区（POST，参数：openid, country, province, city, district）
- `/weather/weather` 获取天气（参数：district）
- `/weather/area/provinces` 获取省份列表
- `/weather/area/cities` 获取城市列表（参数：province）
- `/weather/area/districts` 获取区县列表（参数：city_geocode）
- `/weather/area/location_name` 获取所在地名称（参数：city, district）

### 6. 异常与加载处理
- 页面加载时始终先显示 loading。
- 只有接口请求失败时才显示错误提示页面。
- 地区数据未准备好时页面保持 loading，不会出现"未初始化"错误。

### 7. 其它说明
- 全部数据和交互均与后端真实接口保持一致，无任何 mock 数据。
- 代码结构清晰，注释详细，适合新手学习和二次开发。

---

如有问题或建议，欢迎通过 issue 或微信开发者工具反馈。