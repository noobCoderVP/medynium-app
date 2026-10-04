import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { patientRoute, evidenceTarget } from '@/lib/source-link';

import { useEvidenceDrawer } from '../hooks/evidence-context';
import { useEvidence } from '../hooks/use-evidence';
import { recordLabel, sourceLabel, sourceQuery } from '../lib/evidence-label';

interface Props {
  answerId: string;
  statementId: string;
  patientEvidence: string[];
  sourceEvidence: string[];
  /** The patient this statement is about (a panel answer has one per statement). */
  patientId: string | null;
}

/**
 * The proof under a statement, in words: the lab, medicine or label section it rests on, each with a link that opens
 * the real record (the lab on its trend, the label with its full citation). Ids like P1 and S2 stay inside the Why?
 * sheet; they are not what a clinician should have to read.
 */
export function EvidenceChips({ answerId, statementId, patientEvidence, sourceEvidence, patientId }: Props) {
  const router = useRouter();
  const { open } = useEvidenceDrawer();
  const query = useEvidence(answerId);
  const ids = [...patientEvidence, ...sourceEvidence];
  if (ids.length === 0 || !query.data) return null;
  const data = query.data;
  const records = new Map(data.patient_records.map((r) => [r.evidence_id, r]));
  const sources = new Map(data.sources.map((s) => [s.evidence_id, s]));
  const owner = patientId ?? data.patient_id;
  return (
    <View style={styles.stack} accessibilityLabel="Based on">
      <Text variant="caption" color="mutedForeground" bold>
        Based on
      </Text>
      {ids.map((id) => {
        const record = records.get(id);
        const source = sources.get(id);
        if (!record && !source) return null;
        const link = record ? evidenceTarget(owner, record.table, record.value) : null;
        const text = source ? sourceLabel(source) : record ? recordLabel(record) : id;
        const openIt = source
          ? () => router.push({ pathname: '/knowledge', params: { q: sourceQuery(source) } })
          : link
            ? () => router.push(patientRoute(link.target))
            : null;
        return (
          <View key={id} style={styles.row}>
            <Icon name={source ? 'document-text-outline' : 'flask-outline'} size={16} color="mutedForeground" />
            <Text variant="label" style={styles.text}>
              {text}
            </Text>
            {openIt ? (
              <Button
                title={source ? 'Label' : (link?.label ?? 'Open')}
                size="sm"
                variant="ghost"
                onPress={openIt}
                accessibilityLabel={`${source ? 'Open label' : (link?.label ?? 'Open')}: ${text}`}
              />
            ) : null}
            <Button
              title="Details"
              size="sm"
              variant="ghost"
              onPress={() => open({ answerId, statementId })}
              accessibilityLabel={`Details for ${text}`}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  text: { flexShrink: 1 },
});
