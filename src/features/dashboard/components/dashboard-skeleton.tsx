import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/** Placeholders shaped like the dashboard (tiles, then patient rows), so the page does not jump when data arrives. */
export function DashboardSkeleton() {
  return (
    <View style={styles.stack} accessibilityLabel="Loading dashboard">
      <View style={styles.tiles}>
        {[0, 1, 2, 3].map((i) => (
          <Card key={i} style={styles.tile}>
            <Skeleton width="50%" height={26} />
            <Skeleton width="70%" height={12} />
          </Card>
        ))}
      </View>
      {[0, 1, 2].map((i) => (
        <Card key={i} style={styles.row}>
          <Skeleton width={40} height={40} />
          <View style={styles.lines}>
            <Skeleton width="60%" height={16} />
            <Skeleton width="85%" height={12} />
            <Skeleton width="40%" height={12} />
          </View>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tile: { flexGrow: 1, flexBasis: '45%', gap: 8 },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  lines: { flex: 1, gap: 8 },
});
