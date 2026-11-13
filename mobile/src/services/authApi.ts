import { apiClient } from './api';

export interface UserProfileData {
  user_id: string;
  display_name: string;
  username: string;
  bio?: string | null;
  avatar_url?: string | null;
  city: string;
  general_locality: string;
  skills: string[];
  interests: string[];
  services_offered: string[];
  rating_avg: number;
  reviews_count: number;
  completed_activities_count: number;
  is_id_verified: boolean;
}

export interface UserData {
  id: string;
  email: string;
  role: 'user' | 'moderator' | 'admin';
  is_email_verified: boolean;
  is_active: boolean;
  created_at: string;
  profile?: UserProfileData;
}

export interface AuthResponseData {
  user: UserData;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface AuthApiResponse {
  success: boolean;
  message: string;
  data: AuthResponseData;
}

export interface RegisterPayload {
  email: string;
  password: string;
  display_name: string;
  username: string;
  city?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  async register(payload: RegisterPayload): Promise<AuthResponseData> {
    const res = await apiClient.post<AuthApiResponse>('/auth/register', payload);
    return res.data.data;
  },

  async login(payload: LoginPayload): Promise<AuthResponseData> {
    const res = await apiClient.post<AuthApiResponse>('/auth/login', payload);
    return res.data.data;
  },

  async googleAuth(idToken: string): Promise<AuthResponseData> {
    const res = await apiClient.post<AuthApiResponse>('/auth/google', { id_token: idToken });
    return res.data.data;
  },

  async refreshToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string }> {
    const res = await apiClient.post<{ success: boolean; data: { access_token: string; refresh_token: string } }>(
      '/auth/refresh',
      { refresh_token: refreshToken }
    );
    return res.data.data;
  },

  async getCurrentUser(): Promise<UserData> {
    const res = await apiClient.get<{ success: boolean; user: UserData }>('/auth/me');
    return res.data.user;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async deleteAccount(): Promise<void> {
    await apiClient.delete('/auth/account');
  },
};

