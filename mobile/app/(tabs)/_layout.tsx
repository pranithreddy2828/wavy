import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import {
  Home,
  Compass,
  PlusCircle,
  Clock,
  User,
} from 'lucide-react-native';

export default function TabsLayout() {
  const { colors, isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBarBackground,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          height: 62,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={22} color={color} />,
        }}
      />

      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, size }) => <Compass size={22} color={color} />,
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          title: 'Ask Help',
          tabBarIcon: ({ color, size }) => <PlusCircle size={22} color={color} />,
        }}
      />

      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color, size }) => <Clock size={22} color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
