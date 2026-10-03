import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Text } from '@/components/ui/text';
import { FontFamily } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * The mark from the web header: a rounded primary square holding the lucide HeartPulse glyph. Same paths, same
 * proportions (32 px square, 16 px glyph at 2 px strokes scales with `size`).
 */
export function LogoMark({ size = 32 }: { size?: number }) {
  const theme = useTheme();
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.mark, { width: size, height: size, borderRadius: size / 4, backgroundColor: theme.primary }]}
    >
      <Svg
        width={size / 2}
        height={size / 2}
        viewBox="0 0 24 24"
        fill="none"
        stroke={theme.primaryForeground}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
        <Path d="M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
      </Svg>
    </View>
  );
}

/** Mark plus wordmark, as in the web's top-left corner. */
export function Logo({ size = 32, showName = true }: { size?: number; showName?: boolean }) {
  return (
    <View style={styles.row} accessible accessibilityRole="image" accessibilityLabel="Medynium">
      <LogoMark size={size} />
      {showName && (
        <Text style={[styles.name, { fontSize: size * 0.56, lineHeight: size * 0.75 }]} accessibilityElementsHidden>
          Medynium
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mark: { alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontFamily: FontFamily.heading, letterSpacing: -0.4 },
});
