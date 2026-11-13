import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export default function NotFoundScreen() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect back to the home screen
    router.replace('/');
  }, [router]);

  return (
    <View style={{ flex: 1, backgroundColor: '#121316', alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" color="#1A73E8" />
    </View>
  );
}

