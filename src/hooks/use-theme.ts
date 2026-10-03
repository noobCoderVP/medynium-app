import { useColorScheme } from 'react-native';

import { Colors, type ThemeColors } from '@/constants/theme';
import { useThemePreference } from '@/lib/theme-preference';

/** The colours for the active scheme: the user's choice, or the phone's setting when they have not chosen. */
export function useTheme(): ThemeColors & { scheme: 'light' | 'dark' } {
  const system = useColorScheme();
  const preference = useThemePreference();
  const scheme = preference === 'system' ? (system === 'dark' ? 'dark' : 'light') : preference;
  return { ...Colors[scheme], scheme };
}
