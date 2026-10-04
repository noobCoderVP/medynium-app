import { RefreshControl, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MaxContentWidth } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * Standard screen container: themed background, safe-area padding, centred max width.
 * Set `header={false}` for screens without a native header (tab roots) so content clears the status bar.
 */
export function Screen({
  children,
  scroll = true,
  header = true,
  center = false,
  refreshing,
  onRefresh,
  contentStyle,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  header?: boolean;
  /** Centres the content vertically when it is shorter than the screen (sign-in and similar single-task screens). */
  center?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  contentStyle?: ViewStyle;
}) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const pad = { paddingTop: header ? 8 : insets.top + 8 };

  if (!scroll) {
    return <View style={[styles.fill, { backgroundColor: theme.background }, pad]}>{children}</View>;
  }
  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={[
        styles.content,
        center && styles.center,
        pad,
        { paddingBottom: insets.bottom + 24 },
        contentStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={theme.mutedForeground} />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { flexGrow: 1, justifyContent: 'center' },
  content: { paddingHorizontal: 16, gap: 16, width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center' },
});
