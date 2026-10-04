import { StyleSheet, View } from 'react-native';

import { RouteChip } from '@/components/shared/route-chip';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { StreamAnswer } from '@/lib/api/events';
import { copy } from '@/lib/copy';

import { useEvidenceDrawer } from '../hooks/evidence-context';
import { LimitsBlock } from './limits-block';
import { Statement } from './statement';

/**
 * A structured answer: the short answer, each tagged statement with its evidence button, conflicts and limits.
 * A safety review with no statements is the honest gap, in the words the copy deck fixes, never "no risk" (AI-05).
 */
export function AnswerView({ answer }: { answer: StreamAnswer }) {
  const { open } = useEvidenceDrawer();
  const gap = answer.kind === 'SAFETY' && answer.considerations.length === 0;
  return (
    <View style={styles.stack} accessibilityLabel="Answer">
      <View style={styles.row}>
        {answer.route ? (
          <RouteChip route={answer.route.route} model={answer.route.model} costNote={answer.route.cost_note} />
        ) : null}
      </View>
      <Text variant="heading" accessibilityLiveRegion="polite">
        {gap ? copy.gap.title : answer.short_answer}
      </Text>
      {gap ? <Text color="mutedForeground">{copy.gap.note}</Text> : null}
      {answer.considerations.map((item) => (
        <Statement key={item.id} answerId={answer.answer_id} item={item} patientId={answer.patient_id} />
      ))}
      {answer.conflicts.length > 0 && (
        <Card style={styles.conflict}>
          <View style={styles.row}>
            <Icon name="warning-outline" size={16} color="warning" />
            <Text variant="label" color="warning">
              Sources disagree
            </Text>
          </View>
          {answer.conflicts.map((c) => (
            <Text key={`${c.drug}-${c.section}`}>
              {[c.drug, c.section].filter(Boolean).join(', ')}: {c.items.join(' vs ')}
            </Text>
          ))}
        </Card>
      )}
      <LimitsBlock limits={answer.limits} />
      <Button
        title="Why? Show all evidence"
        variant="secondary"
        icon="help-circle-outline"
        onPress={() => open({ answerId: answer.answer_id })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  conflict: { gap: 4 },
});
