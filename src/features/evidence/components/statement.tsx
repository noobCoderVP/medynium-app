import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import type { StreamAnswer } from '@/lib/api/events';
import { copy } from '@/lib/copy';
import { patientRoute } from '@/lib/source-link';

import { useEvidenceDrawer } from '../hooks/evidence-context';
import { EvidenceChips } from './evidence-chips';
import { TagChip } from './tag-chip';

type Consideration = StreamAnswer['considerations'][number];

/**
 * One answer statement: its tag (icon and words), the statement, and a button that opens its evidence.
 * The AI-synthesis tag always carries the hedge, so it can never read as a clinical conclusion.
 */
export function Statement({
  answerId,
  item,
  patientId,
  action,
}: {
  answerId: string;
  item: Consideration;
  /** The patient the answer is about; a statement of a panel answer carries its own. */
  patientId?: string | null;
  /** Optional extra control shown under the Why? button. */
  action?: React.ReactNode;
}) {
  const { open } = useEvidenceDrawer();
  const router = useRouter();
  const owner = item.patient_id ?? patientId ?? null;
  const patients = item.patient_evidence.length;
  const sources = item.source_evidence.length;
  return (
    <Card style={styles.card}>
      <View style={styles.tags}>
        <TagChip tag={item.tag} />
        {item.tag === 'ai_synthesis' ? (
          <Text variant="caption" color="synth">
            {copy.synthesisHedge}
          </Text>
        ) : null}
      </View>
      {item.group ? (
        <Text variant="caption" color="mutedForeground" bold>
          {item.group.toUpperCase()}
        </Text>
      ) : null}
      <Text>{item.text}</Text>
      {item.patient_id ? (
        <Button
          title={`Open ${item.patient_id}`}
          size="sm"
          variant="ghost"
          onPress={() => router.push(patientRoute({ patientId: item.patient_id as string }))}
        />
      ) : null}
      <EvidenceChips
        answerId={answerId}
        statementId={item.id}
        patientEvidence={item.patient_evidence}
        sourceEvidence={item.source_evidence}
        patientId={owner}
      />
      <Button
        title={`Why? ${patients} patient record${patients === 1 ? '' : 's'}, ${sources} source${sources === 1 ? '' : 's'}`}
        size="sm"
        variant="secondary"
        icon="help-circle-outline"
        onPress={() => open({ answerId, statementId: item.id })}
      />
      {action}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: 8 },
  tags: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
});
