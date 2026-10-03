import { Stack } from 'expo-router';

import { AgentProvider } from '@/features/agent';

export default function AppLayout() {
  return (
    // Mounted only while signed in, so a conversation is dropped on sign-out.
    <AgentProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="patient/[patientId]" />
      </Stack>
    </AgentProvider>
  );
}
