import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet } from '@/components/ui/sheet';
import { Text } from '@/components/ui/text';
import { describeError } from '@/lib/api/error-message';

import { useChangePassword } from '../hooks/use-change-password';

export function ChangePasswordSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const change = useChangePassword();

  function close() {
    setCurrent('');
    setNext('');
    change.reset();
    onClose();
  }

  return (
    <Sheet visible={visible} onClose={close} title="Change password">
      <View style={styles.form}>
        {change.isSuccess ? (
          <>
            <Text accessibilityRole="alert">Your password is changed. Other devices were signed out.</Text>
            <Button title="Done" onPress={close} />
          </>
        ) : (
          <>
            <Input label="Current password" value={current} onChangeText={setCurrent} password autoCapitalize="none" />
            <Input label="New password" value={next} onChangeText={setNext} password autoCapitalize="none" />
            {change.isError && (
              <Text variant="label" color="destructive" accessibilityRole="alert">
                {describeError(change.error)}
              </Text>
            )}
            <Button
              title="Change password"
              loading={change.isPending}
              disabled={!current || next.length < 1}
              onPress={() => change.mutate({ current, next })}
            />
          </>
        )}
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({ form: { gap: 12, paddingBottom: 8 } });
