import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';

/** A titled block. The title is a header for screen readers; `aside` is a count or a short note. */
export function Section({ title, aside, children }: { title: string; aside?: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.head}>
        <Text variant="heading" accessibilityRole="header">
          {title}
        </Text>
        {aside ? (
          <Text variant="caption" color="mutedForeground">
            {aside}
          </Text>
        ) : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 8 },
  head: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
});
