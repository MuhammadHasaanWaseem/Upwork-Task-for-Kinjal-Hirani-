import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Pressable } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { AuthProvider } from '@/provider/AuthProviders';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
      <Stack initialRouteName='(auth)' screenOptions={{
              headerTransparent: true, headerLeft: ({ canGoBack }) => (
                <Pressable onPress={canGoBack ? () => router.back() : undefined}>
                  <ArrowLeft color={'white'} />
                </Pressable>
              )
            }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false,presentation:'modal',animation:'ios_from_left' }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false,presentation:'modal',animation:'ios_from_left' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
