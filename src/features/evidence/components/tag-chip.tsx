import { StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Radius, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { copy, type TagKey } from '@/lib/copy';

const STYLE: Record<TagKey, { icon: IconName; color: ThemeColor; soft: ThemeColor }> = {
  patient_fact: { icon: 'person-circle-outline', color: 'fact', soft: 'factSoft' },
  retrieved_source: { icon: 'document-text-outline', color: 'source', soft: 'sourceSoft' },
  ai_synthesis: { icon: 'sparkles-outline', color: 'synth', soft: 'synthSoft' },
};

/** The provenance of a statement: icon shape and words, never colour alone (NFR-10). */
export function TagChip({ tag }: { tag: TagKey }) {
  const theme = useTheme();
  const { icon, color, soft } = STYLE[tag];
  return (
    <View
      accessible
      accessibilityLabel={`${copy.tags[tag].label}. ${copy.tags[tag].hint}`}
      style={[styles.chip, { borderColor: theme[color], backgroundColor: theme[soft] }]}
    >
      <Icon name={icon} size={13} color={color} />
      <Text variant="caption" color={color} bold>
        {copy.tags[tag].label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
});
