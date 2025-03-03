import { Stack } from 'expo-router';
import React from 'react';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function AppLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        },
        headerTintColor: Colors[colorScheme ?? 'light'].tint,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitle: 'App para perrites', // Cambia esto al nombre de tu aplicación
      }}>
      {/* <Stack.Screen name="index" /> */}
      {/* <Stack.Screen name="explore" /> */}
    </Stack>
  );
}
