import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { BrandBar } from '@/components/brand/brand-bar';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { useTheme } from '@/hooks/use-theme';

/** A tab root: the shared brand bar on top, then a scrolling page with pull to refresh. */
export function TabScreen({
  children,
  refreshing,
  onRefresh,
  right,
  back = false,
}: {
  children: React.ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
  right?: React.ReactNode;
  /** For a page reached from More rather than from the tab bar: shows a Back button. */
  back?: boolean;
}) {
  const theme = useTheme();
  const router = useRouter();
  return (
    <View style={[styles.fill, { backgroundColor: theme.background }]}>
      <BrandBar right={right} />
      <Screen refreshing={refreshing} onRefresh={onRefresh}>
        {back && (
          <View style={styles.back}>
            <Button title="Back" icon="chevron-back" variant="ghost" size="sm" onPress={() => router.back()} />
          </View>
        )}
        {children}
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 }, back: { alignItems: 'flex-start' } });
