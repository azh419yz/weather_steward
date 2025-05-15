/**
 * 应用服务 - 提供全局状态管理
 */
import { CityData } from './weatherService';

// 全局状态接口
interface AppState {
  currentLocation: CityData | null;
  weatherData: any[];
  loading: boolean;
  lastUpdateTime: string;
  error: string | null;
}

// 初始状态
const initialState: AppState = {
  currentLocation: null,
  weatherData: [],
  loading: false,
  lastUpdateTime: '',
  error: null
};

// 全局状态
let state: AppState = { ...initialState };

// 状态更新回调函数数组
type StateChangeCallback = (newState: AppState) => void;
const listeners: StateChangeCallback[] = [];

/**
 * 获取当前状态
 * @returns AppState 当前状态
 */
export const getState = (): AppState => {
  return { ...state };
};

/**
 * 更新状态并通知监听器
 * @param newState 新状态
 */
const setState = (newState: Partial<AppState>) => {
  state = { ...state, ...newState };
  // 更新最后更新时间
  state.lastUpdateTime = new Date().toLocaleString('zh-CN', { hour12: false });
  // 通知所有监听器
  listeners.forEach(listener => listener(state));
};

/**
 * 添加状态变化监听器
 * @param callback 回调函数
 * @returns 移除监听器的函数
 */
export const subscribe = (callback: StateChangeCallback): (() => void) => {
  listeners.push(callback);
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
};

/**
 * 更新当前位置
 * @param location 位置信息
 */
export const updateLocation = async (location: CityData): Promise<void> => {
  try {
    setState({
      currentLocation: location,
      loading: true,
      error: null
    });
    // 只更新位置，不再请求mock天气
    return Promise.resolve();
  } catch (error) {
    console.error('更新位置失败:', error);
    setState({
      error: '更新位置失败，请稍后重试',
      loading: false
    });
    return Promise.reject(error);
  }
};