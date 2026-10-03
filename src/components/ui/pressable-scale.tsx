import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { spring } from '@/lib/motion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface PressableScaleProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  /** How far it shrinks while pressed. */
  to?: number;
}

/** A pressable that gives under the finger and springs back, like a native control. */
export function PressableScale({ style, to = 0.97, onPressIn, onPressOut, ...rest }: PressableScaleProps) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(e) => {
        scale.set(withSpring(to, spring));
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.set(withSpring(1, spring));
        onPressOut?.(e);
      }}
      style={[style, animated]}
    />
  );
}
