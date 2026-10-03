import { Stack } from 'expo-router';
import { View } from 'react-native';

import { AgentProvider } from '@/features/agent';
import { AppLockProvider, LockScreen } from '@/features/lock';

export default function AppLayout() {
  return (
    // Mounted only while signed in: the lock and the conversation are dropped on sign-out.
    <AppLockProvider>
      <AgentProvider>
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="patient/[patientId]" />
          </Stack>
          <LockScreen />
        </View>
      </AgentProvider>
    </AppLockProvider>
  );
}
