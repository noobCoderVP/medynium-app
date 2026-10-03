import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/hooks/use-theme';

function Dot({ delay }: { delay: number }) {
  const theme = useTheme();
  const v = useSharedValue(0.3);
  useEffect(() => {
    v.value = withDelay(
      delay,
      withRepeat(withSequence(withTiming(1, { duration: 380 }), withTiming(0.3, { duration: 380 })), -1),
    );
  }, [delay, v]);
  const style = useAnimatedStyle(() => ({ opacity: v.value, transform: [{ translateY: -3 * v.value }] }));
  return <Animated.View style={[styles.dot, { backgroundColor: theme.agent }, style]} />;
}

/** The "working on it" indicator: three dots that pulse in turn. Decorative; the caller supplies the live text. */
export function TypingDots() {
  return (
    <View style={styles.row} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Dot delay={0} />
      <Dot delay={140} />
      <Dot delay={280} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 5, height: 18 },
  dot: { width: 7, height: 7, borderRadius: 4 },
});
