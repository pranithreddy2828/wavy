import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 30, // 30 seconds
    },
  },
});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#0A0D14',
            },
            headerTintColor: '#F3F4F6',
            headerTitleStyle: {
              fontWeight: '700',
            },
            contentStyle: {
              backgroundColor: '#0A0D14',
            },
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: 'WAVY System Hub',
              headerShown: true,
            }}
          />
        </Stack>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

