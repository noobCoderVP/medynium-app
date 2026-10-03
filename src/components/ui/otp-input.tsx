import { useRef } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Six digit boxes backed by one hidden input, so paste and SMS/email autofill work. */
export function OtpInput({
  value,
  onChange,
  length = 6,
}: {
  value: string;
  onChange: (v: string) => void;
  length?: number;
}) {
  const theme = useTheme();
  const ref = useRef<TextInput>(null);

  return (
    <Pressable accessibilityLabel="Verification code" onPress={() => ref.current?.focus()} style={styles.row}>
      {Array.from({ length }, (_, i) => {
        const active = i === Math.min(value.length, length - 1);
        return (
          <View
            key={i}
            style={[styles.box, { borderColor: active ? theme.foreground : theme.border, backgroundColor: theme.card }]}
          >
            <Text variant="title">{value[i] ?? ''}</Text>
          </View>
        );
      })}
      <TextInput
        ref={ref}
        value={value}
        onChangeText={(t) => onChange(t.replace(/\D/g, '').slice(0, length))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={length}
        style={styles.hidden}
        caretHidden
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, justifyContent: 'space-between' },
  box: {
    flex: 1,
    height: 56,
    borderWidth: 1.5,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hidden: { position: 'absolute', opacity: 0, width: '100%', height: '100%' },
});
