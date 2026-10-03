import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Chips } from '@/components/ui/chips';
import { Input } from '@/components/ui/input';
import { Sheet } from '@/components/ui/sheet';
import { Text } from '@/components/ui/text';
import { describeError } from '@/lib/api/error-message';

import { useCreateInvite } from '../hooks/use-admin';

/** Invite a doctor or an assistant. The person receives an email with a one-time link; nothing is created until you send. */
export function CreateInviteSheet({
  visible,
  onClose,
  supervisorId,
}: {
  visible: boolean;
  onClose: () => void;
  /** An assistant needs an active supervising doctor; the inviting admin is the default. */
  supervisorId: string | undefined;
}) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'DOCTOR' | 'ASSISTANT'>('ASSISTANT');
  const create = useCreateInvite();

  function close() {
    create.reset();
    onClose();
  }

  return (
    <Sheet visible={visible} onClose={close} title="Invite someone">
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        {create.isSuccess ? (
          <View style={styles.form}>
            <Text accessibilityRole="alert">
              {create.data.email_sent
                ? `Invitation sent to ${create.data.email}.`
                : `Invitation created for ${create.data.email}, but the email could not be sent. Share the link from the web app.`}
            </Text>
            <Button title="Done" onPress={close} />
          </View>
        ) : (
          <View style={styles.form}>
            <Input label="Name" value={name} onChangeText={setName} autoCapitalize="words" />
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Chips
              fill
              options={[
                { value: 'ASSISTANT', label: 'Assistant' },
                { value: 'DOCTOR', label: 'Doctor' },
              ]}
              value={role}
              onChange={(value) => setRole(value ?? 'ASSISTANT')}
            />
            {role === 'ASSISTANT' && (
              <Text variant="caption" color="mutedForeground">
                Assistants are supervised by you. Change this on the web.
              </Text>
            )}
            {create.isError && (
              <Text variant="label" color="destructive" accessibilityRole="alert">
                {describeError(create.error)}
              </Text>
            )}
            <Button
              title="Send invitation"
              icon="paper-plane-outline"
              loading={create.isPending}
              disabled={name.trim().length < 1 || email.trim().length < 3}
              onPress={() =>
                create.mutate({
                  email: email.trim(),
                  display_name: name.trim(),
                  role,
                  is_admin: false,
                  supervising_doctor_id: role === 'ASSISTANT' ? (supervisorId ?? null) : null,
                })
              }
            />
          </View>
        )}
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({ body: { paddingBottom: 8 }, form: { gap: 12 } });
