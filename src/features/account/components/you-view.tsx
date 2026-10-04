import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Section } from '@/components/shared/section';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Chips } from '@/components/ui/chips';
import { Reveal } from '@/components/ui/reveal';
import { ScreenHeader } from '@/components/ui/screen-header';
import { TabScreen } from '@/components/ui/tab-screen';
import { Text } from '@/components/ui/text';
import { useSession } from '@/features/session';
import { setThemePreference, useThemePreference } from '@/lib/theme-preference';

import { ChangePasswordSheet } from './change-password-sheet';

export function YouView() {
  const router = useRouter();
  const { user, signOut } = useSession();
  const theme = useThemePreference();
  const [changing, setChanging] = useState(false);
  return (
    <TabScreen>
      <ScreenHeader title="More" />
      <Reveal index={0}>
        <Card style={styles.profile}>
          <Avatar name={user?.display_name ?? ''} size={56} />
          <View style={styles.who}>
            <Text variant="heading">{user?.display_name}</Text>
            <Text color="mutedForeground" numberOfLines={1}>
              {user?.email}
            </Text>
            <View style={styles.badges}>
              <Badge label={user?.role === 'DOCTOR' ? 'Doctor' : 'Assistant'} tone="info" />
              {user?.is_admin ? <Badge label="Admin" tone="muted" /> : null}
              <Badge label={`${user?.patient_count ?? 0} patients`} tone="muted" />
            </View>
          </View>
        </Card>
      </Reveal>
      <Reveal index={1}>
        <Section title="Appearance">
          <Chips
            fill
            options={[
              { value: 'system', label: 'System' },
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
            ]}
            value={theme}
            onChange={(value) => setThemePreference(value ?? 'system')}
          />
        </Section>
      </Reveal>
      <Reveal index={2}>
        <Section title="Browse">
          <Button
            title="Knowledge"
            icon="library-outline"
            variant="secondary"
            onPress={() => router.push('/knowledge')}
          />
          <Button title="Activity" icon="time-outline" variant="secondary" onPress={() => router.push('/activity')} />
          <Button
            title="Documentation"
            icon="help-buoy-outline"
            variant="secondary"
            onPress={() => router.push('/docs')}
          />
        </Section>
      </Reveal>
      <Reveal index={3}>
        <Section title="Account">
          {user?.is_admin && user.role === 'DOCTOR' && (
            <Button title="Admin" icon="settings-outline" variant="secondary" onPress={() => router.push('/admin')} />
          )}
          <Button title="Change password" icon="key-outline" variant="secondary" onPress={() => setChanging(true)} />
          <Button title="Sign out" icon="log-out-outline" variant="secondary" onPress={() => void signOut()} />
        </Section>
      </Reveal>
      <Reveal index={4}>
        <Text variant="caption" color="mutedForeground" style={styles.note}>
          No patient data is stored on this device. The app locks after a minute away and blocks screenshots. Version{' '}
          {Constants.expoConfig?.version ?? '1.0.0'}.
        </Text>
      </Reveal>
      <ChangePasswordSheet visible={changing} onClose={() => setChanging(false)} />
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  profile: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  who: { flex: 1, gap: 4 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  note: { textAlign: 'center' },
});
