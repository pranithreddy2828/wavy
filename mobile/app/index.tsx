import React from 'react';
import { Redirect } from 'expo-router';

/**
 * Root Entry Point:
 * Directs the user straight into the clean, modern 5-tab application experience.
 */
export default function Index() {
  return <Redirect href="/(tabs)/index" />;
}
