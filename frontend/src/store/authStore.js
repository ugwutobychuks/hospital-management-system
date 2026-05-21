import { create } from 'zustand';
import api from '../utils/api';

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,

  init: () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    if (token && user) {
      set({ user: JSON.parse(user) });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Login failed', isLoading: false });
      return false;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/register', data);
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Registration failed', isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    set({ user: null });
  },
}));