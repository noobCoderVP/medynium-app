import { forwardRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps, type ViewStyle } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  /** Shows a show/hide toggle and hides the text by default. */
  password?: boolean;
  /** Overrides for the bordered field container (the TextInput `style` only styles the text). */
  fieldStyle?: ViewStyle;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { label, error, password, style, fieldStyle, multiline, ...rest },
  ref,
) {
  const theme = useTheme();
  const [hidden, setHidden] = useState(!!password);

  return (
    <View style={styles.wrap}>
      {label && (
        <Text variant="label" color="mutedForeground">
          {label}
        </Text>
      )}
      <View
        style={[
          styles.field,
          { borderColor: error ? theme.destructive : theme.border, backgroundColor: theme.card },
          multiline && styles.multiline,
          fieldStyle,
        ]}
      >
        <TextInput
          ref={ref}
          accessibilityLabel={label}
          placeholderTextColor={theme.mutedForeground}
          secureTextEntry={hidden}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          style={[styles.input, { color: theme.foreground }, style]}
          {...rest}
        />
        {password && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            hitSlop={12}
            onPress={() => setHidden((h) => !h)}
          >
            <Icon name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color="mutedForeground" />
          </Pressable>
        )}
      </View>
      {error && (
        <Text variant="caption" color="destructive">
          {error}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  multiline: { alignItems: 'flex-start', paddingVertical: 8, minHeight: 96 },
  input: { flex: 1, fontSize: 16, paddingVertical: 10 },
});
