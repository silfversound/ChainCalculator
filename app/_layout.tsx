import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { isLoggedInAtom } from './atoms';

export default function RootLayout() {
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (!isLoggedIn && segments[0] === '(screens)') {
      router.replace('/login');
    } else if (isLoggedIn && segments[0] !== '(screens)' && segments[0] !== 'login') {
      router.replace('/(screens)/home');
    }
  }, [isLoggedIn, segments]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen 
          name="login" 
          options={{ 
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="(screens)" 
          options={{ 
            headerShown: false,
          }} 
        />
      </Stack>
    </ThemeProvider>
  );
}
