import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScreenHeader } from '@/components/ui/screen-header';
import { TabScreen } from '@/components/ui/tab-screen';
import { Text } from '@/components/ui/text';
import { useSession } from '@/features/session';

import { ChangePasswordSheet } from './change-password-sheet';

export function YouView() {
  const router = useRouter();
  const { user, signOut } = useSession();
  const [changing, setChanging] = useState(false);
  return (
    <TabScreen>
      <ScreenHeader title="You" />
      <Card style={styles.card}>
        <Text variant="heading">{user?.display_name}</Text>
        <Text color="mutedForeground">{user?.email}</Text>
        <Text color="mutedForeground">
          {user?.role === 'DOCTOR' ? 'Doctor' : 'Assistant'} · {user?.patient_count ?? 0} patients
        </Text>
      </Card>
      <Button title="Activity" icon="time-outline" variant="secondary" onPress={() => router.push('/activity')} />
      {user?.is_admin && user.role === 'DOCTOR' && (
        <Button title="Admin" icon="settings-outline" variant="secondary" onPress={() => router.push('/admin')} />
      )}
      <Button title="Change password" icon="key-outline" variant="secondary" onPress={() => setChanging(true)} />
      <Button title="Sign out" icon="log-out-outline" variant="secondary" onPress={() => void signOut()} />
      <Text variant="caption" color="mutedForeground">
        No patient data is stored on this device. Signing out clears everything held in memory.
      </Text>
      <ChangePasswordSheet visible={changing} onClose={() => setChanging(false)} />
    </TabScreen>
  );
}

const styles = StyleSheet.create({ card: { gap: 4 } });
