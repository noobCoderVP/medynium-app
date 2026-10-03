import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { OtpInput } from '@/components/ui/otp-input';
import { Text } from '@/components/ui/text';
import { describeError } from '@/lib/api/error-message';
import { ApiError } from '@/lib/api/errors';
import type { OtpChallenge } from '@/lib/api/types';
import { copy } from '@/lib/copy';

import { useSession } from '../hooks/session-context';

export function OtpForm({ challenge, onCancel }: { challenge: OtpChallenge; onCancel: () => void }) {
  const { verifyOtp } = useSession();
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      await verifyOtp(challenge.challenge, code);
    } catch (e) {
      setError(e instanceof ApiError && e.status === 401 ? copy.auth.otpWrong : describeError(e));
      setBusy(false);
    }
  }

  return (
    <View style={styles.form}>
      <Text color="mutedForeground">
        We emailed a six-digit code to {challenge.email_hint}. It expires in {challenge.expires_in_minutes} minutes.
      </Text>
      <OtpInput value={code} onChange={setCode} />
      {error && (
        <Text variant="label" color="destructive" accessibilityRole="alert" accessibilityLiveRegion="polite">
          {error}
        </Text>
      )}
      <Button title="Verify and sign in" onPress={submit} loading={busy} disabled={code.length !== 6} />
      <Button title="Use a different account" variant="ghost" onPress={onCancel} />
    </View>
  );
}

const styles = StyleSheet.create({ form: { gap: 14 } });
