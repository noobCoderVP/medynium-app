import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { DataState } from '@/components/shared/data-state';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { describeError } from '@/lib/api/error-message';
import { copy } from '@/lib/copy';
import { formatDate } from '@/lib/format';

import { useAcceptInvite, useInvitePreview } from '../hooks/use-invite';

/**
 * Finish an invitation or a password reset: shows who it is for, then sets the password. A bad, used or expired link
 * all look the same ("no longer valid"), so nothing hints at which accounts exist.
 */
export function InviteForm({ token, onDone }: { token: string; onDone: () => void }) {
  const preview = useInvitePreview(token);
  const accept = useAcceptInvite(token);
  const [password, setPassword] = useState('');
  const [again, setAgain] = useState('');
  const mismatch = again.length > 0 && again !== password;

  if (accept.isSuccess) {
    return (
      <View style={styles.form}>
        <Text accessibilityRole="alert">{copy.auth.inviteDone}</Text>
        <Button title="Go to sign in" onPress={onDone} />
      </View>
    );
  }

  return (
    <DataState
      query={preview}
      notFound={
        <EmptyState icon="link-outline" title="This link is no longer valid." description={copy.auth.inviteInvalid} />
      }
    >
      {(invite) => (
        <View style={styles.form}>
          <Card style={styles.who}>
            <Text variant="heading">{invite.display_name}</Text>
            <Text color="mutedForeground">{invite.email}</Text>
            <Text variant="caption" color="mutedForeground">
              {invite.kind === 'INVITE' ? 'Invitation' : 'Password reset'} · expires {formatDate(invite.expires_at)}
            </Text>
          </Card>
          <Input label="New password" value={password} onChangeText={setPassword} password autoCapitalize="none" />
          <Input
            label="Repeat password"
            value={again}
            onChangeText={setAgain}
            password
            autoCapitalize="none"
            error={mismatch ? 'The two passwords do not match.' : undefined}
          />
          {accept.isError && (
            <Text variant="label" color="destructive" accessibilityRole="alert">
              {describeError(accept.error)}
            </Text>
          )}
          <Button
            title={invite.kind === 'INVITE' ? 'Set password and activate' : 'Set new password'}
            loading={accept.isPending}
            disabled={password.length < 1 || password !== again}
            onPress={() => accept.mutate(password)}
          />
        </View>
      )}
    </DataState>
  );
}

const styles = StyleSheet.create({ form: { gap: 14 }, who: { gap: 2 } });
