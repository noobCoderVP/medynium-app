import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { FontFamily } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Up to two initials, ignoring titles like "Dr". */
export function initials(name: string): string {
  const parts = name
    .replace(/\b(dr|mr|mrs|ms)\.?\s/gi, '')
    .split(/\s+/)
    .filter(Boolean);
  const letters = (parts.length > 1 ? [parts[0], parts[parts.length - 1]] : parts).map((part) =>
    part[0]?.toUpperCase(),
  );
  return letters.join('') || '?';
}

/** A round initials badge. Decorative: the name is always written next to it. */
export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const theme = useTheme();
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: theme.accent }]}
    >
      <Text color="accentForeground" style={{ fontFamily: FontFamily.semibold, fontSize: size * 0.38 }}>
        {initials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({ avatar: { alignItems: 'center', justifyContent: 'center' } });
