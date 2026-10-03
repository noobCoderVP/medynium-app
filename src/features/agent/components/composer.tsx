import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { copy } from '@/lib/copy';

/** One field with Send, which becomes Stop while the assistant is working. */
export function Composer({
  running,
  onSend,
  onStop,
}: {
  running: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
}) {
  const theme = useTheme();
  const [text, setText] = useState('');
  const canSend = text.trim().length > 0 && !running;

  function send() {
    if (!canSend) return;
    onSend(text.trim());
    setText('');
  }

  return (
    <View style={[styles.row, { borderColor: theme.border, backgroundColor: theme.card }]}>
      <TextInput
        accessibilityLabel="Ask or tell the assistant what to do"
        placeholder={copy.agent.placeholder}
        placeholderTextColor={theme.mutedForeground}
        value={text}
        onChangeText={setText}
        onSubmitEditing={send}
        returnKeyType="send"
        multiline
        maxLength={1000}
        style={[styles.input, { color: theme.foreground }]}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={running ? 'Stop' : 'Send'}
        accessibilityState={{ disabled: !running && !canSend }}
        disabled={!running && !canSend}
        onPress={running ? onStop : send}
        style={[styles.button, { backgroundColor: theme.primary, opacity: running || canSend ? 1 : 0.4 }]}
      >
        <Icon name={running ? 'stop' : 'arrow-up'} size={20} color="primaryForeground" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, borderWidth: 1, borderRadius: Radius.lg, padding: 6 },
  input: { flex: 1, fontSize: 16, maxHeight: 120, paddingHorizontal: 8, paddingVertical: 8 },
  button: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
