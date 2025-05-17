import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Stack } from 'expo-router';
import { Platform } from 'react-native';

const modalScreenOptions: NativeStackNavigationOptions = {
  presentation: Platform.OS === 'ios' ? 'modal' : 'transparentModal',
  headerShown: false,
  gestureEnabled: true,
  gestureDirection: 'vertical',
  animation: 'slide_from_bottom',
  contentStyle: { backgroundColor: 'transparent' },
};

export default function ScreensLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="home" 
        options={{
          title: 'Home',
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="user" 
        options={modalScreenOptions}
      />
      <Stack.Screen 
        name="chat" 
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
} 