// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  config => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    console.log('API Request:', {
      method: config.method,
      url: config.url,
      data: config.data,
    });
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    console.log('API Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('API Response Error:', error.response ? {
      status: error.response.status,
      data: error.response.data
    } : error);
    return Promise.reject(error);
  }
);

export default api;