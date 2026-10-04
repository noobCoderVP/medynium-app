import { StyleSheet, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import type { ReportRow } from '@/lib/api/types';

const FLAGS: Record<string, string> = {
  unmatched_test: 'Test name not recognised',
  unmatched_drug: 'Medicine not recognised',
  no_date: 'No date on the report',
  duplicate: 'Already in the record',
  already_listed: 'Already on the medicine list',
};

const fieldsText = (fields: ReportRow['fields']) =>
  Object.entries(fields)
    .filter(([, value]) => value !== null && value !== '')
    .map(([key, value]) => `${key.replaceAll('_', ' ')}: ${String(value)}`)
    .join(' · ');

/** One row read from a report: the words and page it came from, and Accept or Reject while it is undecided. */
export function ReportRowCard({
  row,
  busy,
  onDecide,
}: {
  row: ReportRow;
  busy: boolean;
  onDecide?: (decision: 'accept' | 'reject') => void;
}) {
  const done = row.status === 'APPROVED' || row.status === 'REJECTED';
  return (
    <Card style={styles.row}>
      <View style={styles.top}>
        <Text variant="label" style={styles.title}>
          {row.kind}: {fieldsText(row.fields)}
        </Text>
        <Badge label={row.status} tone={row.status === 'REJECTED' ? 'muted' : 'info'} />
      </View>
      <Text variant="caption" color="mutedForeground">
        {row.collected_at
          ? `Collected ${row.collected_at}${row.time_known ? '' : ' (time not on the report, noon assumed)'}`
          : 'No collection date'}{' '}
        · page {row.source_page} · confidence {Math.round(row.confidence * 100)}%
      </Text>
      <Text variant="caption" color="mutedForeground">
        “{row.source_quote}”
      </Text>
      {row.flags.length > 0 && (
        <Text variant="caption" color="warning" bold>
          {row.flags.map((flag) => FLAGS[flag] ?? flag).join('; ')}
        </Text>
      )}
      {onDecide && !done && (
        <View style={styles.actions}>
          <Button title="Accept" size="sm" variant="secondary" disabled={busy} onPress={() => onDecide('accept')} />
          <Button title="Reject" size="sm" variant="secondary" disabled={busy} onPress={() => onDecide('reject')} />
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { gap: 4 },
  top: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  title: { flex: 1 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 4 },
});
