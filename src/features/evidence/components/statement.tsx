import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import type { StreamAnswer } from '@/lib/api/events';
import { copy } from '@/lib/copy';

import { useEvidenceDrawer } from '../hooks/evidence-context';
import { TagChip } from './tag-chip';

type Consideration = StreamAnswer['considerations'][number];

/**
 * One answer statement: its tag (icon and words), the statement, and a button that opens its evidence.
 * The AI-synthesis tag always carries the hedge, so it can never read as a clinical conclusion.
 */
export function Statement({ answerId, item }: { answerId: string; item: Consideration }) {
  const { open } = useEvidenceDrawer();
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
      <Text>{item.text}</Text>
      <Button
        title={`Why? ${patients} patient record${patients === 1 ? '' : 's'}, ${sources} source${sources === 1 ? '' : 's'}`}
        size="sm"
        variant="secondary"
        icon="help-circle-outline"
        onPress={() => open({ answerId, statementId: item.id })}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: 8 },
  tags: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
});
