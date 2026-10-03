import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

export function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <Card style={styles.tile} accessible accessibilityLabel={`${label}: ${value}`}>
      <Text variant="title">{value}</Text>
      <Text variant="caption" color="mutedForeground">
        {label}
      </Text>
    </Card>
  );
}

export function StatGrid({ children }: { children: React.ReactNode }) {
  return <View style={styles.grid}>{children}</View>;
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tile: { flexGrow: 1, flexBasis: '45%', gap: 2 },
});
