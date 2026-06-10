import axios from 'axios';
import { ElMessage } from 'element-plus';
import { clearAdminAuth, getAdminToken } from '../utils/auth';

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 15000
});

service.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

service.interceptors.response.use(
  (response) => {
    const payload = response.data;
    if (!payload || typeof payload.code === 'undefined') {
      return payload;
    }
    if (payload.code === 0) {
      return payload.data;
    }
    if (payload.code === 401) {
      clearAdminAuth();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return Promise.reject(new Error(payload.message || '登录已失效'));
    }
    ElMessage.error(payload.message || '请求失败');
    return Promise.reject(new Error(payload.message || '请求失败'));
  },
  (error) => {
    const payload = error.response?.data;
    if (payload?.code === 401) {
      clearAdminAuth();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    ElMessage.error(payload?.message || error.message || '网络错误');
    return Promise.reject(error);
  }
);

export default service;
