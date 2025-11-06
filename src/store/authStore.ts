import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/models.types';
import { authService } from '@/services/auth/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      
      setUser: (user) => set({ user }),
      
      setToken: (token) => set({ token }),
      
      clearAuth: () => set({ user: null, token: null }),
      
      isAuthenticated: () => {
        const token = get().token;
        return !!token && authService.isAuthenticated();
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

