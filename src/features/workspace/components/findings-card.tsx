import { StyleSheet, View } from 'react-native';

import { DataState } from '@/components/shared/data-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useEvidenceDrawer } from '@/features/evidence';
import type { Finding } from '@/lib/api/types';
import { formatDate, formatDateTime } from '@/lib/format';

import { useFindings } from '../hooks/use-findings';
import { STATUS } from '../lib/finding-status';
import { DecisionForm } from './decision-form';

function detail(f: Finding): string | null {
  if (f.status === 'DISMISSED' && f.reason) return `Reason: ${f.reason}`;
  if (f.status === 'FLAGGED' && f.follow_up_on) return `Follow up on ${formatDate(f.follow_up_on)}`;
  if (f.status === 'ESCALATED') return `With ${f.assigned_to_name ?? 'a colleague'}`;
  return null;
}

/**
 * What was decided about each review conclusion. A conclusion is added here from the review, then acknowledged,
 * followed up, escalated or dismissed with a reason. Nothing is decided for the clinician: the assistant cannot
 * add or change a finding.
 */
export function FindingsCard({ patientId }: { patientId: string }) {
  const { query, decide } = useFindings(patientId);
  const { open } = useEvidenceDrawer();
  return (
    <View style={styles.stack}>
      <Text variant="heading" accessibilityRole="header">
        Findings{query.data ? ` · ${query.data.open_count} open` : ''}
      </Text>
      <DataState
        query={query}
        isEmpty={(list) => list.items.length === 0}
        empty={{
          title: 'No safety findings yet',
          description: 'Run a safety review, then choose Add to findings on a conclusion to record what you decide.',
        }}
      >
        {(list) => (
          <>
            {list.items.map((f) => (
              <Card key={f.finding_id} style={styles.item}>
                <View style={styles.row}>
                  <Badge label={STATUS[f.status].label} tone={STATUS[f.status].tone} />
                  <Button
                    title="Why?"
                    size="sm"
                    variant="ghost"
                    icon="help-circle-outline"
                    onPress={() => open({ answerId: f.answer_id, statementId: f.consideration_id })}
                  />
                </View>
                <Text>{f.summary}</Text>
                <Text variant="caption" color="mutedForeground">
                  Raised {formatDateTime(f.created_at)}
                  {f.created_by_name ? ` by ${f.created_by_name}` : ''}
                </Text>
                {detail(f) ? (
                  <Text variant="caption" color="mutedForeground">
                    {detail(f)}
                  </Text>
                ) : null}
                <DecisionForm
                  patientId={patientId}
                  finding={f}
                  pending={decide.isPending}
                  error={decide.variables?.findingId === f.finding_id ? decide.error : null}
                  onDecide={(body) => decide.mutate({ findingId: f.finding_id, body })}
                />
              </Card>
            ))}
          </>
        )}
      </DataState>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 10 },
  item: { gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
});
