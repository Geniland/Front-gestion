import { reactive, computed } from 'vue';
import api from '../api/axios';

const state = reactive({
  user: (() => {
    try {
      const data = localStorage.getItem('user');
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  })(),
  token: localStorage.getItem('token') || null,
});

const auth = {
  state,
  user: computed(() => state.user),
  token: computed(() => state.token),
  isAuthenticated: computed(() => !!state.token),

  clear() {
    state.token = null;
    state.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('site_token');
    localStorage.removeItem('site_user');
  },

async login(credentials) {
  try {
    this.clear();
    const response = await api.post('/login', credentials);
    // console.log(response.data);
    const { token, agent } = response.data;

    state.token = token;
    state.user = agent;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(agent));

    return response.data;
  } catch (error) {
    throw error;
  }
},

  async logout() {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      this.clear();
    }
  },

  async fetchProfile() {
    if (!state.token) return;
    try {
      const response = await api.get('/profile');
      state.user = response.data;
      localStorage.setItem('user', JSON.stringify(state.user));
    } catch (error) {
      this.logout();
    }
  }
};

export default auth;
