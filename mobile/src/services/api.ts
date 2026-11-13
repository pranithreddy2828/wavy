import axios from 'axios';
import Constants from 'expo-constants';

/**
 * Derives the optimal API base URL based on the environment:
 * - If EXPO_PUBLIC_API_URL is configured, use it.
 * - In Expo development, dynamically extract the host IP (LAN) from debuggerHost/manifest2.
 * - Defaults to http://10.0.2.2:5000/api/v1 for standard Android Emulator.
 */
const getBaseUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Extract host IP when running in Expo Go over Wi-Fi
  const debuggerHost = Constants.expoConfig?.hostUri;
  if (debuggerHost) {
    const ip = debuggerHost.split(':')[0];
    return `http://${ip}:5000/api/v1`;
  }

  return 'http://10.0.2.2:5000/api/v1';
};

export const API_BASE_URL = getBaseUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export interface HealthCheckResponse {
  status: string;
  service: string;
  version: string;
  city: string;
  database: {
    status: string;
    error: string | null;
  };
}

export const checkApiHealth = async (): Promise<HealthCheckResponse> => {
  const response = await apiClient.get<HealthCheckResponse>('/health');
  return response.data;
};
