import { StyleSheet, View } from 'react-native';

import { Markdown } from '@/components/shared/markdown';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ListSkeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { TagChip } from '@/features/evidence';
import { formatDateTime } from '@/lib/format';

import { usePatientSummary } from '../hooks/use-patient-summary';

/**
 * The written summary of the patient (web "Patient summary"): stored, shown with when it was written and by whom, and
 * rewritten only when Refresh is pressed. Made from the record and checked against it; decision support only.
 */
export function PatientSummaryCard({ patientId }: { patientId: string }) {
  const { query, refresh } = usePatientSummary(patientId);
  const summary = refresh.data ?? query.data;
  const writing = refresh.isPending;
  const failed = (refresh.isError || query.isError) && !writing;
  return (
    <Card style={styles.card} accessibilityLabel="Patient summary">
      <View style={styles.head}>
        <View style={styles.title}>
          <Text variant="heading" accessibilityRole="header">
            Patient summary
          </Text>
          {summary?.exists ? <TagChip tag={summary.source === 'model' ? 'ai_synthesis' : 'rule_check'} /> : null}
        </View>
        <Button
          title={writing ? 'Writing…' : 'Refresh'}
          icon="refresh-outline"
          size="sm"
          variant="secondary"
          loading={writing}
          disabled={writing || query.isPending}
          accessibilityLabel="Refresh the patient summary"
          onPress={() => refresh.mutate()}
        />
      </View>
      {query.isPending || (writing && !summary?.exists) ? (
        <View accessibilityLiveRegion="polite" style={styles.body}>
          <Text variant="caption" color="mutedForeground">
            {writing ? 'Writing the summary from the record. This takes about fifteen seconds.' : 'Loading…'}
          </Text>
          <ListSkeleton rows={2} />
        </View>
      ) : summary?.exists && summary.markdown ? (
        <View style={styles.body}>
          <Text variant="caption" color="mutedForeground">
            Last updated {summary.generated_at ? formatDateTime(summary.generated_at) : '–'}
            {summary.generated_by ? ` · by ${summary.generated_by}` : ''}
            {summary.source === 'rules' ? ' · made by rules, the language model was unavailable' : ''}
          </Text>
          {summary.changed_since ? (
            <Text variant="caption" color="warning" accessibilityRole="alert">
              The record has changed since this was written. Refresh to include it.
            </Text>
          ) : null}
          {writing ? (
            <Text variant="caption" color="mutedForeground" accessibilityLiveRegion="polite">
              Writing a new version…
            </Text>
          ) : null}
          <Markdown text={summary.markdown} />
          <Text variant="caption" color="mutedForeground">
            Written from this patient&apos;s record and checked against it. Decision support only.
          </Text>
        </View>
      ) : null}
      {failed ? (
        <Text color="destructive" accessibilityRole="alert">
          The summary could not be written. The record is unaffected; try Refresh.
        </Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: 10 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' },
  title: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', flexShrink: 1 },
  body: { gap: 8 },
});
