import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { describeError } from '@/lib/api/error-message';
import { ApiError } from '@/lib/api/errors';
import type { OtpChallenge } from '@/lib/api/types';
import { copy } from '@/lib/copy';

import { useSession } from '../hooks/session-context';

const schema = z.object({
  email: z.string().min(3, 'Enter your email'),
  password: z.string().min(1, 'Enter your password'),
});
type Values = z.infer<typeof schema>;

function messageFor(error: unknown): string {
  if (error instanceof ApiError && error.status === 401) return copy.auth.signInError;
  if (error instanceof ApiError && error.status === 429) return copy.auth.locked;
  return describeError(error);
}

export function SignInForm({
  onChallenge,
  onForgot,
}: {
  onChallenge: (challenge: OtpChallenge) => void;
  onForgot: () => void;
}) {
  const { signIn } = useSession();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } });

  const submit = handleSubmit(async ({ email, password }) => {
    setFormError(null);
    try {
      const challenge = await signIn(email, password);
      if (challenge) onChallenge(challenge);
    } catch (error) {
      setFormError(messageFor(error));
    }
  });

  return (
    <View style={styles.form}>
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <Input
            label="Email"
            value={field.value}
            onChangeText={field.onChange}
            error={errors.email?.message}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            textContentType="username"
            returnKeyType="next"
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <Input
            label="Password"
            value={field.value}
            onChangeText={field.onChange}
            error={errors.password?.message}
            password
            autoCapitalize="none"
            autoComplete="current-password"
            textContentType="password"
            returnKeyType="go"
            onSubmitEditing={submit}
          />
        )}
      />
      {formError && (
        <Text variant="label" color="destructive" accessibilityRole="alert" accessibilityLiveRegion="polite">
          {formError}
        </Text>
      )}
      <Button title="Sign in" onPress={submit} loading={isSubmitting} />
      <Button title="Forgot password?" variant="ghost" onPress={onForgot} />
    </View>
  );
}

const styles = StyleSheet.create({ form: { gap: 14 } });
