import { useColorScheme } from 'react-native';

import { Colors, type ThemeColors } from '@/constants/theme';

export function useTheme(): ThemeColors & { scheme: 'light' | 'dark' } {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  return { ...Colors[scheme], scheme };
}
