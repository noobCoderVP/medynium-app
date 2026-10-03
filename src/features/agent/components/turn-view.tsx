import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { RouteChip } from '@/components/shared/route-chip';
import { StepsList } from '@/components/shared/steps-list';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { TypingDots } from '@/components/ui/typing-dots';
import { AnswerView } from '@/features/evidence';
import { useTheme } from '@/hooks/use-theme';
import { copy } from '@/lib/copy';
import { reveal } from '@/lib/motion';
import type { Turn } from '@/lib/stream-turn';

import { targetForAction } from '../lib/actions';
import { RefusalView } from './refusal-view';

const UNAVAILABLE = new Set(['agent_unavailable', 'timeout']);

/** One question and everything the assistant did about it. Actions are buttons, so each has a manual path. */
export function TurnView({ turn, onRetry }: { turn: Turn; onRetry: () => void }) {
  const router = useRouter();
  const theme = useTheme();
  const error = turn.error;
  return (
    <View style={styles.stack}>
      <Animated.View entering={reveal(0)} style={styles.question}>
        <Card
          style={{ backgroundColor: theme.accent, borderColor: theme.accent }}
          accessibilityLabel={`You asked: ${turn.question}`}
        >
          <Text color="accentForeground">{turn.question}</Text>
        </Card>
      </Animated.View>
      {turn.routes.map((route, i) => (
        <RouteChip key={i} route={route.route} model={route.model} costNote={route.cost_note} />
      ))}
      <StepsList steps={turn.steps} />
      {turn.status === 'running' && turn.steps.length === 0 && (
        <View style={styles.thinking}>
          <TypingDots />
          <Text color="mutedForeground" accessibilityLiveRegion="polite">
            {copy.agent.thinking}
          </Text>
        </View>
      )}
      {turn.actions.map((action, i) => {
        const target = targetForAction(action);
        return target ? (
          <Button
            key={i}
            title={target.label}
            icon="arrow-forward-outline"
            variant="secondary"
            onPress={() =>
              router.push({
                pathname: '/patient/[patientId]',
                params: { patientId: target.patientId, ...target.params },
              })
            }
          />
        ) : null;
      })}
      {turn.answers.map((answer) => (
        <Animated.View key={answer.answer_id} entering={reveal(1)}>
          <AnswerView answer={answer} />
        </Animated.View>
      ))}
      {turn.refusal && <RefusalView refusal={turn.refusal} />}
      {error && (
        <Card style={styles.error} accessibilityRole="alert">
          <Text variant="label" color={error.code === 'interrupted' ? 'foreground' : 'destructive'}>
            {UNAVAILABLE.has(error.code) ? copy.agent.unavailable : error.message}
          </Text>
          {error.retryAfter ? <Text variant="caption">Try again in {error.retryAfter} seconds.</Text> : null}
          <Button title="Ask again" size="sm" variant="secondary" onPress={onRetry} />
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 10 },
  question: { alignSelf: 'flex-end', maxWidth: '90%' },
  thinking: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  error: { gap: 6 },
});
