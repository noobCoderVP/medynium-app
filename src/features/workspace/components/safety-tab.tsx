import { StyleSheet, View } from 'react-native';

import { StepsList } from '@/components/shared/steps-list';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { AnswerView } from '@/features/evidence';
import { copy } from '@/lib/copy';

import { useSafetyReview } from '../hooks/use-safety-review';
import { FindingsCard } from './findings-card';
import { PinsCard } from './pins-card';
import { RaiseFindingButton } from './raise-finding-button';

const UNAVAILABLE = new Set(['agent_unavailable', 'timeout']);

/**
 * Medicines against label text. Every statement carries its tag and opens Why?. A review conclusion can be added to
 * the findings below, where it is acknowledged, followed up, escalated or dismissed. If the assistant is unavailable
 * this tab says so and the rest of the record stays usable (FR-20, NFR-13).
 */
export function SafetyTab({ patientId }: { patientId: string }) {
  const { turn, answer, run, running } = useSafetyReview(patientId);
  const error = turn?.error;
  return (
    <View style={styles.stack}>
      <Text color="mutedForeground">
        Checks the medicines and labs on record against the indexed drug label text. It supports a clinician&apos;s
        review and is not a diagnosis.
      </Text>
      <Button
        title={answer ? 'Run again' : 'Run safety review'}
        icon="shield-checkmark-outline"
        onPress={() => void run()}
        loading={running}
      />
      {turn && <StepsList steps={turn.steps} />}
      {error && (
        <Card style={styles.error} accessibilityRole="alert">
          <Text variant="label" color="destructive">
            {UNAVAILABLE.has(error.code) ? copy.agent.unavailable : error.message}
          </Text>
          {error.retryAfter ? <Text variant="caption">Try again in {error.retryAfter} seconds.</Text> : null}
        </Card>
      )}
      {answer && (
        <AnswerView
          answer={answer}
          statementAction={(item) =>
            item.tag === 'ai_synthesis' || item.tag === 'rule_check' ? (
              <RaiseFindingButton patientId={patientId} answerId={answer.answer_id} considerationId={item.id} />
            ) : null
          }
        />
      )}
      <FindingsCard patientId={patientId} />
      <PinsCard patientId={patientId} />
    </View>
  );
}

const styles = StyleSheet.create({ stack: { gap: 14 }, error: { gap: 4 } });
