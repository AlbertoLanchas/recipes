import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { UserProvider } from '@/contexts/UserContext';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <ThemeProvider>
          <UserProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                presentation: 'card',
                animationTypeForReplace: 'push',
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="search" />
              <Stack.Screen
                name="recipe/[id]"
                options={{
                  presentation: 'card',
                  animationTypeForReplace: 'push',
                }}
              />
              <Stack.Screen name="anime/[name]" />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </UserProvider>
        </ThemeProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}