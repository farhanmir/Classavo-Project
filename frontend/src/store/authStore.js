import { create } from 'zustand';
import api from '@/lib/axios';

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  hasInitialized: false,

  login: (userData, tokens) => {
    const { access, refresh } = tokens;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('user', JSON.stringify(userData));
    }

    set({
      user: userData,
      accessToken: access,
      refreshToken: refresh,
      isAuthenticated: true,
    });
  },

  logout: async () => {
    const refreshToken = typeof window !== 'undefined' 
      ? localStorage.getItem('refreshToken') 
      : null;

    try {
      if (refreshToken) {
        await api.post('/auth/logout/', { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
      }

      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      });
    }
  },

  updateUser: (userData) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
    }
    set({ user: userData });
  },

  initializeAuth: async () => {
    if (typeof window === 'undefined') return;

    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userStr = localStorage.getItem('user');

    if (accessToken && refreshToken && userStr) {
      try {
        // Verify token is still valid by fetching profile
        const response = await api.get('/profile/');
        const userData = response.data;

        set({
          user: userData,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          hasInitialized: true,
        });
      } catch (error) {
        // Token invalid, clear everything
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          hasInitialized: true,
        });
      }
    } else {
      // No saved auth, mark as initialized
      set({ hasInitialized: true });
    }
  },
}));

export default useAuthStore;
