import { StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Flag } from '@/lib/api/types';

const ICONS: Record<Flag['type'], IconName> = {
  NEW_LAB: 'flask-outline',
  NEW_MEDICATION: 'medkit-outline',
  RECENT_EMERGENCY: 'warning-outline',
  NEW_DOCUMENT: 'document-text-outline',
};

/** What changed, as icon plus words (never colour alone). */
export function FlagChips({ flags }: { flags: Flag[] }) {
  const theme = useTheme();
  if (flags.length === 0) return null;
  return (
    <View style={styles.row}>
      {flags.map((flag) => (
        <View key={flag.type} style={[styles.chip, { backgroundColor: theme.muted, borderColor: theme.border }]}>
          <Icon name={ICONS[flag.type]} size={13} color="mutedForeground" />
          <Text variant="caption" color="mutedForeground">
            {flag.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
});
