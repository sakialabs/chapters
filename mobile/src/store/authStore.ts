/**
 * Auth Store - Zustand store for authentication state
 */
import { create } from 'zustand';
import { User } from '@/services/api/types';
import { authAPI } from '@/services/api/auth';
import { clearTokens } from '@/services/api/client';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  loadUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    isLoading: false 
  }),

  loadUser: async () => {
    try {
      set({ isLoading: true });
      const user = await authAPI.getCurrentUser();
      set({ 
        user, 
        isAuthenticated: true,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        user: null, 
        isAuthenticated: false,
        isLoading: false 
      });
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
    } finally {
      await clearTokens();
      set({ 
        user: null, 
        isAuthenticated: false 
      });
    }
  },
}));
