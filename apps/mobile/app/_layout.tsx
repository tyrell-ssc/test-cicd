import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SpaceMono_400Regular } from '@expo-google-fonts/space-mono';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Linking from 'expo-linking';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EnvironmentProvider, useAuthStore } from '@test-cicd/app';
import { config } from '@test-cicd/app';
import { analyticsService } from '@test-cicd/app';
import { errorTrackingService } from '@test-cicd/app';
import { useColorScheme } from 'react-native';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutContent({ colorScheme }: { colorScheme: 'light' | 'dark' | null | undefined }) {
  const session = useAuthStore((state) => state.session);
  const isLoading = useAuthStore((state) => state.isLoading);
  const router = useRouter();

  useEffect(() => {
    analyticsService.initialize();
    errorTrackingService.initialize();
  }, []);

  // Handle deep links when app is already open
  useEffect(() => {
    const handleUrl = ({ url }: { url: string }) => {
      const urlObj = new URL(url);

      // Check if this is an auth callback
      if (urlObj.pathname === '/auth/callback' || urlObj.host === 'auth') {
        router.push('/auth/callback');
      }
    };

    const subscription = Linking.addEventListener('url', handleUrl);
    return () => subscription.remove();
  }, [router]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Protected guard={session !== null && !isLoading}>
          <Stack.Screen name="(authenticated)/(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack.Protected>
        <Stack.Screen name="(public)/index" options={{ headerShown: false }} />
        <Stack.Screen name="auth/callback" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: SpaceMono_400Regular,
    ...FontAwesome.font,
  });
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <EnvironmentProvider environment={config.app.env}>
        <RootLayoutContent colorScheme={colorScheme} />
      </EnvironmentProvider>
    </QueryClientProvider>
  );
}
