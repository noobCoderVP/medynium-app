import type { StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { reveal } from '@/lib/motion';

/** Fades and slides its content in when it first appears. `index` staggers items in a list. */
export function Reveal({
  index = 0,
  style,
  children,
}: {
  index?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}) {
  return (
    <Animated.View entering={reveal(index)} style={style}>
      {children}
    </Animated.View>
  );
}
