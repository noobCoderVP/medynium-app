import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, type ErrorBoundaryProps } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { OfflineBanner } from '@/components/offline-banner';
import { ErrorState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';
import { EvidenceProvider } from '@/features/evidence';
import { SessionProvider, useSession } from '@/features/session';
import { useTheme } from '@/hooks/use-theme';
import { queryClient } from '@/lib/query/client';
import { loadThemePreference } from '@/lib/theme-preference';

void SplashScreen.preventAutoHideAsync();

const FONTS = {
  Inter_400Regular: require('../../assets/fonts/Inter_400Regular.ttf'),
  Inter_500Medium: require('../../assets/fonts/Inter_500Medium.ttf'),
  Inter_600SemiBold: require('../../assets/fonts/Inter_600SemiBold.ttf'),
  Inter_700Bold: require('../../assets/fonts/Inter_700Bold.ttf'),
  Roboto_700Bold: require('../../assets/fonts/Roboto_700Bold.ttf'),
};

/** Root error boundary: a render crash shows a recoverable screen instead of a blank app. */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <SafeAreaProvider>
      <Screen header={false}>
        <ErrorState message={error.message || 'An unexpected error occurred.'} onRetry={() => void retry()} />
      </Screen>
    </SafeAreaProvider>
  );
}

function RootNavigator() {
  const { status, retry } = useSession();
  const [fontsLoaded, fontError] = useFonts(FONTS);
  useEffect(() => {
    void loadThemePreference();
  }, []);
  const fontsReady = fontsLoaded || !!fontError; // a font failure falls back to the system font, never a blank app

  useEffect(() => {
    if (status !== 'loading' && fontsReady) void SplashScreen.hideAsync();
  }, [status, fontsReady]);

  // The splash stays up until we know whether a session exists, so there is no sign-in flash.
  if (status === 'loading' || !fontsReady) return null;
  if (status === 'unreachable') {
    return (
      <Screen header={false}>
        <ErrorState
          message="We could not reach Medynium. Your session is kept. Check your connection and try again."
          onRetry={retry}
        />
      </Screen>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={status === 'signedIn'}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={status === 'signedOut'}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}

function Themed({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const base = theme.scheme === 'dark' ? DarkTheme : DefaultTheme;
  return (
    <ThemeProvider
      value={{
        ...base,
        colors: {
          ...base.colors,
          background: theme.background,
          card: theme.background,
          text: theme.foreground,
          border: theme.border,
          primary: theme.primary,
        },
      }}
    >
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      {children}
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <Themed>
              <OfflineBanner />
              <EvidenceProvider>
                <RootNavigator />
              </EvidenceProvider>
            </Themed>
          </SessionProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
