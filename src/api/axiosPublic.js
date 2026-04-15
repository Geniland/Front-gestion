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

export default apiPublic;