import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888';
axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: API_URL + '/api',
});

// Add a request interceptor to include auth token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
