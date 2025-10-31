import axios, { AxiosInstance } from 'axios';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3600/api/v1';

const commonHeaders = {
  'Content-Type': 'application/json',
};

const unauthorizedAxiosInstance: AxiosInstance = axios.create({ 
  baseURL: API_URL,
  headers: commonHeaders,
  withCredentials: true,
});


const authorizedAxiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: commonHeaders,
  withCredentials: true,
});

authorizedAxiosInstance.interceptors.request.use(
  async (config) => {
    const token = Cookies.get('auth-token');
    console.log('API request token:', token ? token.substring(0, 20) + '...' : 'null');
    
    if (token && token.trim() !== '') {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Authorization header set');
    } else {
      console.log('No valid token found for API request');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    if (error.response?.status === 401) {
      console.log('401 Unauthorized - clearing token and redirecting');
      // Remove invalid token
      Cookies.remove('auth-token');
      
      // Show error message
      toast.error('Session expired. Please login again.');
      
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export const unauthorizedAPI = unauthorizedAxiosInstance;
export const authorizedAPI = authorizedAxiosInstance;