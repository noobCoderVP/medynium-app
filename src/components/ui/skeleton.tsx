import { useEffect } from 'react';
import { StyleSheet, View, type DimensionValue } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function Skeleton({ width = '100%', height = 16 }: { width?: DimensionValue; height?: number }) {
  const theme = useTheme();
  const opacity = useSharedValue(0.5);
  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, [opacity]);
  const animated = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[{ width, height, backgroundColor: theme.muted, borderRadius: Radius.sm }, animated]} />;
}

/** A stack of card-shaped placeholders for list screens. */
export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  const theme = useTheme();
  return (
    <View style={styles.list} accessibilityLabel="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <View key={i} style={[styles.row, { borderColor: theme.border, backgroundColor: theme.card }]}>
          <Skeleton width="70%" height={16} />
          <Skeleton width="40%" height={12} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
  row: { gap: 10, borderWidth: 1, borderRadius: Radius.lg, padding: 14 },
});
