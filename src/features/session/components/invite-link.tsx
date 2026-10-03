import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';

import { extractInviteToken } from '../lib/invite-token';

/** "I have an invitation": paste the emailed link (or its code) to set a password in the app. */
export function InviteLink({ onOpen }: { onOpen: (token: string) => void }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [bad, setBad] = useState(false);

  if (!open) return <Button title="I have an invitation" variant="ghost" onPress={() => setOpen(true)} />;

  function submit() {
    const token = extractInviteToken(text);
    setBad(!token);
    if (token) onOpen(token);
  }

  return (
    <View style={styles.box}>
      <Input
        label="Paste your invitation link"
        value={text}
        onChangeText={(value) => {
          setText(value);
          setBad(false);
        }}
        autoCapitalize="none"
        autoCorrect={false}
        onSubmitEditing={submit}
        returnKeyType="go"
      />
      {bad && (
        <Text variant="label" color="destructive" accessibilityRole="alert">
          That does not look like an invitation link.
        </Text>
      )}
      <Button title="Continue" variant="secondary" onPress={submit} disabled={text.trim().length < 10} />
    </View>
  );
}

const styles = StyleSheet.create({ box: { gap: 10 } });
