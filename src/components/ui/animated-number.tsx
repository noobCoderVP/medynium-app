import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

import { Text, type TextProps } from '@/components/ui/text';

const DURATION_MS = 650;

/**
 * Counts up to its value once when it first appears, easing out. With "reduce motion" on it shows the value at
 * once. The accessibility label always carries the final value, so a screen reader never reads a half-counted number.
 */
export function AnimatedNumber({
  value,
  format = (n: number) => String(Math.round(n)),
  ...textProps
}: { value: number; format?: (n: number) => string } & Omit<TextProps, 'children'>) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    let frame = 0;
    let cancelled = false;
    void AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (cancelled) return;
      if (reduced) {
        setShown(value);
        return;
      }
      const start = Date.now();
      const tick = () => {
        const t = Math.min(1, (Date.now() - start) / DURATION_MS);
        setShown(value * (1 - (1 - t) ** 3));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <Text accessibilityLabel={format(value)} {...textProps}>
      {format(shown)}
    </Text>
  );
}
