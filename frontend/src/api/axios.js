import axios from 'axios';

// To'g'ridan-to'g'ri DigitalOcean backend manzili
export const API_URL = 'https://toyxona-43cx9.ondigitalocean.app';

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
