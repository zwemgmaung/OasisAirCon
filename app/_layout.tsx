import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertProvider } from '@/template';
import { AppProvider } from '../contexts/AppContext';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <AppProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="job/add" options={{ presentation: 'modal' }} />
            <Stack.Screen name="job/[id]" options={{ presentation: 'modal' }} />
            <Stack.Screen name="staff/add" options={{ presentation: 'modal' }} />
            <Stack.Screen name="staff/[id]" options={{ presentation: 'modal' }} />
            <Stack.Screen name="sale/add" options={{ presentation: 'modal' }} />
            <Stack.Screen name="sale/[id]" options={{ presentation: 'modal' }} />
            <Stack.Screen name="purchase/add" options={{ presentation: 'modal' }} />
            <Stack.Screen name="purchase/[id]" options={{ presentation: 'modal' }} />
            <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
            <Stack.Screen name="about" options={{ presentation: 'modal' }} />
          </Stack>
        </AppProvider>
      </SafeAreaProvider>
    </AlertProvider>
  );
}
