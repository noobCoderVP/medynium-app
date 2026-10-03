import { StyleSheet, View, type ViewProps } from 'react-native';

import { PressableScale } from '@/components/ui/pressable-scale';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function Card({ style, ...rest }: ViewProps) {
  const theme = useTheme();
  return <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }, style]} {...rest} />;
}

export function PressableCard({
  onPress,
  onLongPress,
  label,
  children,
}: {
  onPress?: () => void;
  onLongPress?: () => void;
  label: string;
  children: React.ReactNode;
}) {
  const theme = useTheme();
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      onLongPress={onLongPress}
      to={0.98}
      style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
    >
      {children}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: Radius.lg, padding: 14 },
});
