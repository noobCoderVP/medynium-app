import { StyleSheet, View } from 'react-native';

import { BrandBar } from '@/components/brand/brand-bar';
import { Screen } from '@/components/ui/screen';
import { useTheme } from '@/hooks/use-theme';

/** A tab root: the shared brand bar on top, then a scrolling page with pull to refresh. */
export function TabScreen({
  children,
  refreshing,
  onRefresh,
  right,
}: {
  children: React.ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
  right?: React.ReactNode;
}) {
  const theme = useTheme();
  return (
    <View style={[styles.fill, { backgroundColor: theme.background }]}>
      <BrandBar right={right} />
      <Screen refreshing={refreshing} onRefresh={onRefresh}>
        {children}
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });
