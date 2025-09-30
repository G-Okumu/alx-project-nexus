import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthUser, LoginRequest, RegisterRequest, LoadingState } from '@/types';
import { authApi } from '@/lib/api/auth';

interface AuthState extends LoadingState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authApi.login(credentials);
          const { user, token } = response;
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Login failed';
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: message,
          });
          throw error;
        }
      },

      register: async (data: RegisterRequest) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authApi.register(data);
          const { user, token } = response;
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Registration failed';
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: message,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: () => {
        const { token } = get();
        if (token) {
          // Verify token validity here if needed
          // For now, just check if token exists
          set({ isAuthenticated: true });
        } else {
          set({ isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);