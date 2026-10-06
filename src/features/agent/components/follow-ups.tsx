import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import type { Turn } from '@/lib/stream-turn';

type Answer = Turn['answers'][number];

/** One-tap next questions after an answer. The assistant remembers the answer, so "the first one" and "list them" work. */
function followUps(answer: Answer): string[] {
  if (answer.kind === 'PANEL') {
    const summaryOnly = answer.considerations.length === 0;
    return [
      ...(summaryOnly ? ['List them'] : []),
      'Open the first one',
      'What changed since Monday?',
      'What is pending?',
    ];
  }
  if (answer.patient_id && answer.kind !== 'SAFETY') {
    return ['What changed since the last visit?', 'Run the safety review', 'What are the current medications?'];
  }
  return [];
}

export function FollowUps({ answer, onPick }: { answer: Answer; onPick: (question: string) => void }) {
  const options = followUps(answer);
  if (options.length === 0) return null;
  return (
    <View style={styles.row} accessibilityLabel="Follow-up questions">
      {options.map((text) => (
        <Button key={text} title={text} variant="secondary" size="sm" onPress={() => onPick(text)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
