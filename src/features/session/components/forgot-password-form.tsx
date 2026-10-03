import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { describeError } from '@/lib/api/error-message';
import { copy } from '@/lib/copy';

import { useForgotPassword } from '../hooks/use-forgot-password';

export function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState('');
  const forgot = useForgotPassword();

  if (forgot.isSuccess) {
    return (
      <View style={styles.form}>
        <Text accessibilityRole="alert">{copy.auth.forgotSent}</Text>
        <Button title="Back to sign in" onPress={onBack} />
      </View>
    );
  }

  return (
    <View style={styles.form}>
      <Text color="mutedForeground">Enter your work email and we will send a reset link.</Text>
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
      />
      {forgot.isError && (
        <Text variant="label" color="destructive" accessibilityRole="alert">
          {describeError(forgot.error)}
        </Text>
      )}
      <Button
        title="Send reset link"
        onPress={() => forgot.mutate(email)}
        loading={forgot.isPending}
        disabled={email.trim().length < 3}
      />
      <Button title="Back to sign in" variant="ghost" onPress={onBack} />
    </View>
  );
}

const styles = StyleSheet.create({ form: { gap: 14 } });
