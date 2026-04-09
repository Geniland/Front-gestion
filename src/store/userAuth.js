import { reactive, computed } from 'vue';
import api from '../api/axios';

const state = reactive({
  user: (() => {
    try {
      const data = localStorage.getItem('site_user');
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  })(),
  token: localStorage.getItem('site_token') || null,
});

const userAuth = {
  state,
  user: computed(() => state.user),
  token: computed(() => state.token),
  isAuthenticated: computed(() => !!state.token),

  async login(credentials) {
    const response = await api.post('/public/login', credentials);
    const { token, user } = response.data;
    state.token = token;
    state.user = user;
    localStorage.setItem('site_token', token);
    localStorage.setItem('site_user', JSON.stringify(user));
    return response.data;
  },

  async register(payload) {
    const response = await api.post('/public/register', payload);
    const { token, user } = response.data;
    if (token && user) {
      state.token = token;
      state.user = user;
      localStorage.setItem('site_token', token);
      localStorage.setItem('site_user', JSON.stringify(user));
    }
    return response.data;
  },

  async logout() {
    try {
      await api.post('/public/logout');
    } catch (e) {
      // ignore
    } finally {
      state.token = null;
      state.user = null;
      localStorage.removeItem('site_token');
      localStorage.removeItem('site_user');
    }
  }
};

export default userAuth;

