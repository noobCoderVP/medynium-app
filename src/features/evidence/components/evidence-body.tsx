import { StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/ui/empty-state';
import { Text } from '@/components/ui/text';
import type { EvidenceResponse } from '@/lib/api/types';
import { formatDate, formatDateTime } from '@/lib/format';

import { useEvidencePins } from '../hooks/use-evidence';
import { evidenceFor } from '../lib/evidence-link';
import { PatientRecordItem, SourceItem, SqlItem } from './evidence-items';

function Group({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text variant="heading" accessibilityRole="header">
        {title} <Text color="mutedForeground">({count})</Text>
      </Text>
      {count === 0 ? <Text color="mutedForeground">None for this answer.</Text> : children}
    </View>
  );
}

/** The three evidence groups. The selected statement's items are marked. */
export function EvidenceBody({ data, statementId }: { data: EvidenceResponse; statementId: string | null }) {
  const linked = evidenceFor(data.statement_map, statementId);
  const { isPinned, pinFor, failed } = useEvidencePins(data.patient_id, data.answer_id);

  if (data.patient_records.length + data.sql.length + data.sources.length === 0) {
    return <EmptyState title="This answer has no stored evidence." />;
  }
  return (
    <View style={styles.stack}>
      <Text variant="caption" color="mutedForeground">
        Answer {data.answer_id} · created {formatDateTime(data.created_at)}
        {data.route
          ? ` · route ${data.route.route}${data.route.model ? ` (${data.route.model})` : ' (no model call)'}`
          : ''}
        {data.snapshot_date ? ` · source snapshot ${formatDate(data.snapshot_date)}` : ''}
      </Text>
      {failed && (
        <Text variant="label" color="destructive" accessibilityRole="alert">
          Could not pin that item. Try again.
        </Text>
      )}
      <Group title="Patient records" count={data.patient_records.length}>
        {data.patient_records.map((item) => (
          <PatientRecordItem
            key={item.evidence_id}
            item={item}
            highlighted={linked.has(item.evidence_id)}
            pinned={isPinned(item.evidence_id)}
            onPin={pinFor(item.evidence_id)}
          />
        ))}
      </Group>
      <Group title="Retrieved sources" count={data.sources.length}>
        {data.sources.map((item) => (
          <SourceItem
            key={item.evidence_id}
            item={item}
            highlighted={linked.has(item.evidence_id)}
            pinned={isPinned(item.evidence_id)}
            onPin={pinFor(item.evidence_id)}
          />
        ))}
      </Group>
      <Group title="SQL that ran" count={data.sql.length}>
        {data.sql.map((item) => (
          <SqlItem key={item.sql_id} item={item} />
        ))}
      </Group>
    </View>
  );
}

const styles = StyleSheet.create({ stack: { gap: 18 }, group: { gap: 8 } });
