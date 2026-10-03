import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';

/**
 * Title row for tab roots. `actions` sit flush with the right gutter (icon buttons are 44px hit areas
 * with centred glyphs, so they're pulled in by 10px to align the glyph — not the hit area — with the content edge).
 */
export function ScreenHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text variant="title" style={styles.title} numberOfLines={1} accessibilityRole="header">
          {title}
        </Text>
        {actions && <View style={styles.actions}>{actions}</View>}
      </View>
      {subtitle ? (
        <Text color="mutedForeground" numberOfLines={2}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 2 },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 44 },
  title: { flex: 1 },
  actions: { flexDirection: 'row', alignItems: 'center', marginRight: -10 },
});
