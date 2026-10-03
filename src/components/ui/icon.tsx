import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

import type { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export function Icon({ name, size = 20, color = 'foreground' }: { name: IconName; size?: number; color?: ThemeColor }) {
  const theme = useTheme();
  return <Ionicons name={name} size={size} color={theme[color]} />;
}
