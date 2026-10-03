import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';

import { Logo } from '@/components/brand/logo';
import { Reveal } from '@/components/ui/reveal';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { InviteLink, OtpForm, SignInForm } from '@/features/session';
import type { OtpChallenge } from '@/lib/api/types';
import { copy } from '@/lib/copy';

export default function SignInScreen() {
  const router = useRouter();
  const [challenge, setChallenge] = useState<OtpChallenge | null>(null);

  return (
    <KeyboardAvoidingView style={styles.fill} behavior="padding">
      <Screen header={false} contentStyle={styles.content}>
        <Reveal index={0} style={styles.heading}>
          <Logo size={44} />
          <Text variant="title" accessibilityRole="header" style={styles.welcome}>
            Welcome back
          </Text>
          <Text color="mutedForeground">Sign in to your patient workspace.</Text>
        </Reveal>
        <Reveal index={2}>
          {challenge ? (
            <OtpForm challenge={challenge} onCancel={() => setChallenge(null)} />
          ) : (
            <SignInForm onChallenge={setChallenge} onForgot={() => router.push('/forgot-password')} />
          )}
        </Reveal>
        {!challenge && (
          <InviteLink onOpen={(token) => router.push({ pathname: '/invite/[token]', params: { token } })} />
        )}
        <Text variant="caption" color="mutedForeground" style={styles.note}>
          {copy.banner}
        </Text>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { gap: 24, paddingTop: 48 },
  heading: { gap: 6 },
  welcome: { marginTop: 20 },
  note: { textAlign: 'center' },
});
