import axios, { AxiosError, AxiosResponse } from 'axios';
import { API_CONFIG } from '@/utils/constants/api';
import { STORAGE_KEYS } from '@/utils/constants/config';

const BASE_URL = API_CONFIG.BASE_URL;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Only redirect to login if 401 and NOT already on login/register page
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath === '/login' || currentPath === '/register';
      
      if (!isAuthPage) {
        // Handle unauthorized - only redirect if not on auth pages
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

