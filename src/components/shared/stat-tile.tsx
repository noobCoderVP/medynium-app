import { StyleSheet, View } from 'react-native';

import { AnimatedNumber } from '@/components/ui/animated-number';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

/** A number tile. A numeric value counts up on first show; `format` turns it into text (money, grouping). */
export function StatTile({
  label,
  value,
  format,
}: {
  label: string;
  value: string | number;
  format?: (n: number) => string;
}) {
  const spoken = typeof value === 'number' ? (format ? format(value) : String(value)) : value;
  return (
    <Card style={styles.tile} accessible accessibilityLabel={`${label}: ${spoken}`}>
      {typeof value === 'number' ? (
        <AnimatedNumber value={value} format={format} variant="title" />
      ) : (
        <Text variant="title">{value}</Text>
      )}
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
