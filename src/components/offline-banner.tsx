import Animated from 'react-native-reanimated';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/use-theme';
import { fadeOut, revealUp } from '@/lib/motion';
import { useOnline } from '@/lib/network';

/** Thin banner shown while the device is offline. Nothing is stored on the device, so screens simply cannot load. */
export function OfflineBanner() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  if (useOnline()) return null;

  return (
    <Animated.View
      entering={revealUp}
      exiting={fadeOut}
      accessibilityRole="alert"
      style={[styles.banner, { backgroundColor: theme.warningSoft, paddingTop: insets.top + 4 }]}
    >
      <Text variant="caption" bold color="warning" style={styles.text}>
        You are offline. Screens will load again when you reconnect.
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: { paddingBottom: 4, paddingHorizontal: 16, alignItems: 'center' },
  text: { textAlign: 'center' },
});
