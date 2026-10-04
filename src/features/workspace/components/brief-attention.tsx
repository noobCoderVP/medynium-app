import { StyleSheet, View } from 'react-native';

import { Section } from '@/components/shared/section';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/use-theme';
import type { AttentionItem } from '@/lib/api/types';
import { formatShortDate } from '@/lib/format';
import { sourceTarget, type WorkspaceTarget } from '@/lib/source-link';

const WORD: Record<AttentionItem['severity'], string> = {
  high: 'High priority',
  moderate: 'Worth a look',
  info: 'For information',
};

/** What deserves a look, worst first. Each line opens the record it came from; severity is a word, not just a colour. */
export function BriefAttention({
  patientId,
  items,
  high,
  onOpen,
}: {
  patientId: string;
  items: AttentionItem[];
  high: number;
  onOpen: (target: WorkspaceTarget) => void;
}) {
  const theme = useTheme();
  const dot = { high: theme.critical, moderate: theme.warning, info: theme.mutedForeground };
  return (
    <Section title="Attention" aside={items.length ? `${items.length}${high ? ` (${high} high)` : ''}` : undefined}>
      {items.length === 0 ? (
        <Text color="mutedForeground">
          Nothing stands out by the fixed rules. This is not a statement that nothing needs a look.
        </Text>
      ) : (
        items.map((item, index) => (
          <PressableScale
            key={`${item.kind}-${index}`}
            accessibilityRole="button"
            accessibilityLabel={`${WORD[item.severity]}. ${item.title}. ${item.detail ?? ''} Open the record.`}
            onPress={() => onOpen(sourceTarget(patientId, item.source))}
            to={0.98}
            style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]}
          >
            <View style={[styles.dot, { backgroundColor: dot[item.severity] }]} />
            <View style={styles.main}>
              <Text variant="label" color="primary">
                {item.title}
              </Text>
              <Text variant="caption" color="mutedForeground">
                {[WORD[item.severity], item.detail, item.date ? formatShortDate(item.date) : null]
                  .filter(Boolean)
                  .join(' · ')}
              </Text>
            </View>
          </PressableScale>
        ))
      )}
    </Section>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10, borderWidth: 1, borderRadius: 10, padding: 10, minHeight: 44 },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  main: { flex: 1, gap: 2 },
});
