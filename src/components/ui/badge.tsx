import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { Radius, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function Badge({
  label,
  tone = 'muted',
}: {
  label: string;
  tone?: 'muted' | 'success' | 'warning' | 'destructive' | 'info';
}) {
  const theme = useTheme();
  const fg: ThemeColor = tone === 'muted' ? 'mutedForeground' : tone;
  return (
    <View style={[styles.badge, { backgroundColor: tone === 'muted' ? theme.muted : `${theme[tone]}22` }]}>
      <Text variant="caption" color={fg} bold>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2 },
});
