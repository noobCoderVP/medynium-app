import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Section } from '@/components/shared/section';
import { Button } from '@/components/ui/button';
import { Chips } from '@/components/ui/chips';
import { Screen } from '@/components/ui/screen';
import { ScreenHeader } from '@/components/ui/screen-header';
import { useSession } from '@/features/session';

import { HealthCard } from './health-card';
import { InvitesList } from './invites-list';
import { UsersList } from './users-list';

type Tab = 'health' | 'users' | 'invites';

/**
 * Admin, for doctors flagged is_admin. The Users and Invites tabs are the everyday jobs; entitlements and password
 * resets stay on the web. Hiding this from others is a courtesy: every admin endpoint refuses them with 403.
 */
export function AdminView() {
  const router = useRouter();
  const { user } = useSession();
  const [tab, setTab] = useState<Tab>('health');
  return (
    <Screen>
      <View style={styles.back}>
        <Button title="Back" icon="chevron-back" variant="ghost" size="sm" onPress={() => router.back()} />
      </View>
      <ScreenHeader title="Admin" subtitle="Platform health, people and invitations." />
      <Chips
        fill
        options={[
          { value: 'health', label: 'Health' },
          { value: 'users', label: 'Users' },
          { value: 'invites', label: 'Invites' },
        ]}
        value={tab}
        onChange={(value) => value && setTab(value)}
      />
      {tab === 'health' && (
        <Section title="Platform">
          <HealthCard />
        </Section>
      )}
      {tab === 'users' && <UsersList meId={user?.user_id} />}
      {tab === 'invites' && <InvitesList meId={user?.user_id} />}
    </Screen>
  );
}

const styles = StyleSheet.create({ back: { alignItems: 'flex-start', marginLeft: -12 } });
