import axios from 'axios';

const apiPublic = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: { 'Accept': 'application/json' }
});

apiPublic.interceptors.request.use(config => {
  const token = localStorage.getItem('site_token'); // public token seulement
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiPublic.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('site_token');
      localStorage.removeItem('site_user');
    }
    return Promise.reject(error);
  }
);

export default apiPublic;