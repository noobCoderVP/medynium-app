import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/use-theme';
import { copy } from '@/lib/copy';

/** Required on every screen that shows patient data (SEC-08, AI-07). Visible, not alarming. */
export function SyntheticBanner() {
  const theme = useTheme();
  return (
    <View
      accessibilityRole="summary"
      style={[styles.banner, { backgroundColor: theme.muted, borderColor: theme.border }]}
    >
      <Text variant="caption" color="mutedForeground" style={styles.text}>
        {copy.banner}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  text: { textAlign: 'center' },
});
