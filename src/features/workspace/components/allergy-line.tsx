import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Allergy } from '@/lib/api/types';

/** An empty list is "none recorded", never "none known": the wording must not read as reassurance. */
export const NO_ALLERGIES = 'No allergies recorded';
/** Shown when the server did not send allergy information at all, which is not the same as none recorded. */
export const ALLERGIES_UNAVAILABLE = 'Allergy information unavailable. Check the record.';

export function describeAllergy(allergy: Allergy): string {
  const detail = [allergy.reaction, allergy.severity?.toLowerCase()].filter(Boolean).join(', ');
  return detail ? `${allergy.substance} (${detail})` : allergy.substance;
}

/** Allergies on the identity line of every tab: words and an icon, never colour alone. */
export function AllergyLine({ allergies }: { allergies?: Allergy[] }) {
  const theme = useTheme();
  if (!allergies) {
    return (
      <Text variant="caption" color="warning">
        {ALLERGIES_UNAVAILABLE}
      </Text>
    );
  }
  if (allergies.length === 0) {
    return (
      <Text variant="caption" color="mutedForeground">
        {NO_ALLERGIES}
      </Text>
    );
  }
  const text = allergies.map(describeAllergy).join(', ');
  return (
    <View
      accessible
      accessibilityLabel={`Allergies: ${text}`}
      style={[styles.pill, { backgroundColor: theme.warningSoft }]}
    >
      <Icon name="warning-outline" size={14} color="warning" />
      <Text variant="caption" color="warning" bold style={styles.text}>
        Allergies: {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    alignSelf: 'flex-start',
    borderRadius: Radius.md,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 48,
  },
  text: { flexShrink: 1 },
});
