import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

import { Logo } from '@/components/brand/logo';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { InviteForm } from '@/features/session';

/** Opened from `medynium://invite/<token>` or from the sign-in screen's "I have an invitation". */
export default function InviteScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const router = useRouter();
  return (
    <Screen header={false} contentStyle={styles.content}>
      <Logo size={44} />
      <Text variant="title" accessibilityRole="header">
        Set your password
      </Text>
      <InviteForm token={token} onDone={() => router.replace('/sign-in')} />
    </Screen>
  );
}

const styles = StyleSheet.create({ content: { gap: 20, paddingTop: 48 } });
