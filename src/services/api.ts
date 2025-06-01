import axios from 'axios';
import { APP_CONFIG } from '../constants/config';

const api = axios.create({
  baseURL: APP_CONFIG.api.baseUrl,
  timeout: APP_CONFIG.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(APP_CONFIG.auth.tokenKey);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem(APP_CONFIG.auth.tokenKey);
      localStorage.removeItem("user");
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;