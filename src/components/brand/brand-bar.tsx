import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Logo } from '@/components/brand/logo';
import { useTheme } from '@/hooks/use-theme';

/** The top bar every tab shares: the logo at top left (as on the web), an optional action on the right. */
export function BrandBar({ right, inset = true }: { right?: React.ReactNode; inset?: boolean }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.bar,
        { paddingTop: inset ? insets.top + 6 : 6, backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <Logo />
      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    minHeight: 56,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  right: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center' },
});
