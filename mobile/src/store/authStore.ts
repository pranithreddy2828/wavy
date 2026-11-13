import { create } from 'zustand';
import { authApi, UserData, LoginPayload, RegisterPayload } from '../services/authApi';
import { tokenStorage } from '../services/tokenStorage';

interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  initializeAuth: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  googleLogin: (idToken: string) => Promise<boolean>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  initializeAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = await tokenStorage.getAccessToken();
      if (!token) {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }
      const user = await authApi.getCurrentUser();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      await tokenStorage.clearTokens();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (payload: LoginPayload) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authApi.login(payload);
      await tokenStorage.setAccessToken(data.access_token);
      await tokenStorage.setRefreshToken(data.refresh_token);
      set({ user: data.user, isAuthenticated: true, isLoading: false });
      return true;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Login failed.';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  register: async (payload: RegisterPayload) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authApi.register(payload);
      await tokenStorage.setAccessToken(data.access_token);
      await tokenStorage.setRefreshToken(data.refresh_token);
      set({ user: data.user, isAuthenticated: true, isLoading: false });
      return true;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Registration failed.';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  googleLogin: async (idToken: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authApi.googleAuth(idToken);
      await tokenStorage.setAccessToken(data.access_token);
      await tokenStorage.setRefreshToken(data.refresh_token);
      set({ user: data.user, isAuthenticated: true, isLoading: false });
      return true;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Google login failed.';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authApi.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      await tokenStorage.clearTokens();
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    }
  },

  deleteAccount: async () => {
    set({ isLoading: true, error: null });
    try {
      await authApi.deleteAccount();
      await tokenStorage.clearTokens();
      set({ user: null, isAuthenticated: false, isLoading: false });
      return true;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Account deletion failed.';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
