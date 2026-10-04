import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Section } from '@/components/shared/section';
import { Chips } from '@/components/ui/chips';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/use-theme';
import type { ChangeSet } from '@/lib/api/types';
import { formatShortDate } from '@/lib/format';
import { sourceTarget, type WorkspaceTarget } from '@/lib/source-link';

import { useChanges } from '../hooks/use-brief';

const WINDOWS = [
  { value: 'previous_visit', label: 'Previous visit' },
  { value: '90d', label: '90 days' },
  { value: '1y', label: '1 year' },
] as const;
type Window = (typeof WINDOWS)[number]['value'];

const CATEGORY: Record<string, string> = {
  MEDICATION: 'Medicines',
  LAB: 'Results',
  DIAGNOSIS: 'Diagnoses',
  VISIT: 'Visits',
  NOTE: 'Notes',
  DOCUMENT: 'Reports',
};
const ARROW = { up: '↑ ', down: '↓ ', same: '' } as const;
const SHOWN = 8;

/** What changed, from the previous visit by default, or over the last 90 days or year. Each line opens its record. */
export function BriefChanges({
  patientId,
  initial,
  onOpen,
}: {
  patientId: string;
  initial: ChangeSet;
  onOpen: (target: WorkspaceTarget) => void;
}) {
  const theme = useTheme();
  const [from, setFrom] = useState<Window>('previous_visit');
  const other = useChanges(patientId, from, from !== 'previous_visit');
  const set = from === 'previous_visit' ? initial : other.data;
  return (
    <Section title="What changed">
      <Chips
        label="Compare with"
        options={WINDOWS.map((w) => ({ value: w.value, label: w.label }))}
        value={from}
        onChange={(value) => value && setFrom(value)}
        fill
      />
      {!set ? (
        other.isError ? (
          <Text color="destructive" accessibilityRole="alert">
            The comparison could not be loaded.
          </Text>
        ) : (
          <View style={styles.loading} accessibilityLiveRegion="polite">
            <ActivityIndicator color={theme.mutedForeground} />
            <Text color="mutedForeground">Comparing…</Text>
          </View>
        )
      ) : (
        <>
          <Text color="mutedForeground">
            {set.items.length} change{set.items.length === 1 ? '' : 's'} {set.label}
            {Object.keys(set.counts).length
              ? ` · ${Object.entries(set.counts)
                  .map(([category, n]) => `${n} ${CATEGORY[category] ?? category}`)
                  .join(', ')}`
              : ''}
          </Text>
          {set.items.slice(0, SHOWN).map((item, index) => (
            <PressableScale
              key={`${item.category}-${index}`}
              accessibilityRole="button"
              accessibilityLabel={`${item.title}${item.date ? `, ${formatShortDate(item.date)}` : ''}. Open the record.`}
              onPress={() => onOpen(sourceTarget(patientId, item.source))}
              to={0.98}
              style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]}
            >
              <Text variant="caption" color="mutedForeground" style={styles.date}>
                {item.date ? formatShortDate(item.date) : ''}
              </Text>
              <Text variant="label" color="primary" style={styles.title}>
                {item.direction ? ARROW[item.direction] : ''}
                {item.title}
              </Text>
            </PressableScale>
          ))}
          {set.items.length > SHOWN ? (
            <Text variant="caption" color="mutedForeground">
              The {SHOWN} most recent are shown; the Timeline has the rest.
            </Text>
          ) : null}
        </>
      )}
    </Section>
  );
}

const styles = StyleSheet.create({
  loading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  row: {
    flexDirection: 'row',
    gap: 10,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    minHeight: 44,
    alignItems: 'center',
  },
  date: { width: 52 },
  title: { flex: 1 },
});
