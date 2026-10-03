import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { spring } from '@/lib/motion';

/**
 * Bottom sheet. It springs up over a fading backdrop, follows a downward drag on the handle and the title, and closes
 * on a flick, a backdrop tap or the Android back button. The Modal stays mounted until the exit animation finishes.
 */
export function Sheet({
  visible,
  onClose,
  title,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const [mounted, setMounted] = useState(visible);
  const progress = useSharedValue(0); // 0 hidden, 1 shown
  const drag = useSharedValue(0);

  // Mount as soon as it is asked to show (adjusting state during render is the supported pattern for this).
  if (visible && !mounted) setMounted(true);

  useEffect(() => {
    if (visible) {
      drag.set(0);
      progress.set(withSpring(1, spring));
    } else {
      progress.set(
        withTiming(0, { duration: 200 }, (done) => {
          if (done) runOnJS(setMounted)(false);
        }),
      );
    }
  }, [visible, drag, progress]);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      drag.set(Math.max(0, e.translationY));
    })
    .onEnd((e) => {
      if (drag.value > 110 || e.velocityY > 900) runOnJS(onClose)();
      else drag.set(withSpring(0, spring));
    });

  const backdrop = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1]) * interpolate(drag.value, [0, 300], [1, 0.4], 'clamp'),
  }));
  const sheet = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(progress.value, [0, 1], [height, 0]) + drag.value }],
  }));

  if (!mounted) return null;
  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <GestureHandlerRootView style={styles.root}>
        <Animated.View style={[styles.backdrop, backdrop]}>
          <Pressable style={styles.fill} onPress={onClose} accessibilityLabel="Close" />
        </Animated.View>
        {/* Modals are not resized for the keyboard on edge-to-edge Android, so pad by its height. */}
        <KeyboardAvoidingView behavior="padding" style={styles.host} pointerEvents="box-none">
          <Animated.View
            style={[
              styles.sheet,
              { backgroundColor: theme.card, borderColor: theme.border, paddingBottom: insets.bottom + 16 },
              sheet,
            ]}
          >
            <GestureDetector gesture={pan}>
              <View style={styles.handleArea} accessibilityLabel="Drag down to close">
                <View style={[styles.grabber, { backgroundColor: theme.border }]} />
                {title ? (
                  <Text variant="heading" style={styles.title} accessibilityRole="header">
                    {title}
                  </Text>
                ) : null}
              </View>
            </GestureDetector>
            {children}
          </Animated.View>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </Modal>
  );
}

export interface SheetAction {
  label: string;
  icon?: React.ComponentProps<typeof import('@/components/ui/icon').Icon>['name'];
  destructive?: boolean;
  onPress: () => void;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  fill: { flex: 1 },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' },
  host: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: 16,
    maxHeight: '88%',
  },
  handleArea: { paddingTop: 8, paddingBottom: 4 },
  grabber: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, marginBottom: 12 },
  title: { marginBottom: 8 },
});
