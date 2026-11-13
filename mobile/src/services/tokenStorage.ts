import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'wavy_access_token';
const REFRESH_TOKEN_KEY = 'wavy_refresh_token';

// In-memory fallback for web environments
let memoryStore: Record<string, string> = {};

export const tokenStorage = {
  async setAccessToken(token: string): Promise<void> {
    if (Platform.OS === 'web') {
      memoryStore[ACCESS_TOKEN_KEY] = token;
      return;
    }
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  },

  async getAccessToken(): Promise<string | null> {
    if (Platform.OS === 'web') {
      return memoryStore[ACCESS_TOKEN_KEY] || null;
    }
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },

  async setRefreshToken(token: string): Promise<void> {
    if (Platform.OS === 'web') {
      memoryStore[REFRESH_TOKEN_KEY] = token;
      return;
    }
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  },

  async getRefreshToken(): Promise<string | null> {
    if (Platform.OS === 'web') {
      return memoryStore[REFRESH_TOKEN_KEY] || null;
    }
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },

  async clearTokens(): Promise<void> {
    if (Platform.OS === 'web') {
      delete memoryStore[ACCESS_TOKEN_KEY];
      delete memoryStore[REFRESH_TOKEN_KEY];
      return;
    }
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  },
};
