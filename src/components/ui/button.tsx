import * as Haptics from 'expo-haptics';
import { ActivityIndicator, StyleSheet, type PressableProps, type ViewStyle } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Text } from '@/components/ui/text';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  title: string;
  variant?: 'default' | 'secondary' | 'ghost' | 'destructive';
  size?: 'md' | 'sm';
  icon?: IconName;
  loading?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  variant = 'default',
  size = 'md',
  icon,
  loading,
  disabled,
  style,
  onPress,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const palette = {
    default: { bg: theme.primary, fg: 'primaryForeground', border: theme.primary },
    secondary: { bg: theme.secondary, fg: 'foreground', border: theme.border },
    ghost: { bg: 'transparent', fg: 'primary', border: 'transparent' },
    destructive: { bg: theme.destructive, fg: 'primaryForeground', border: theme.destructive },
  } as const;
  const p = palette[variant];
  const inactive = disabled || loading;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      disabled={inactive}
      onPress={(e) => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.(e);
      }}
      style={[
        styles.base,
        size === 'sm' ? styles.sm : styles.md,
        { backgroundColor: p.bg, borderColor: p.border, opacity: inactive ? 0.5 : 1 },
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={theme[p.fg]} />
      ) : (
        <>
          {icon && <Icon name={icon} size={size === 'sm' ? 16 : 18} color={p.fg} />}
          <Text variant="label" color={p.fg} bold style={size === 'md' ? styles.mdText : undefined}>
            {title}
          </Text>
        </>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  md: { minHeight: 48, paddingHorizontal: 20 },
  sm: { minHeight: 44, paddingHorizontal: 14 },
  mdText: { fontSize: 15 },
});
