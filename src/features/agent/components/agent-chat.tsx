import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { copy } from '@/lib/copy';
import { useOpenPatient } from '@/lib/open-patient';

import { useAgent } from '../hooks/agent-context';
import { Composer } from './composer';
import { PatientPicker } from './patient-picker';
import { ScopeBar } from './scope-bar';
import { TurnView } from './turn-view';

const PATIENT_STARTERS = ['Brief me on this patient', 'What changed since the last visit?', 'Run the safety review'];
const PANEL_STARTERS = [
  'Who needs attention today?',
  'What is pending for my patients?',
  'Which of my patients have low eGFR?',
];

/**
 * The conversation: who it is about, the thread, starter prompts that fit that scope, and the composer. It is the
 * same conversation in the Ask tab and in the sheet opened from a patient, because the state lives in the provider.
 * `editable` lets the user change the patient; inside a patient's sheet the patient is fixed.
 */
export function AgentChat({
  editable,
  suggestions,
  minHeight,
}: {
  editable: boolean;
  /** Starter prompts for the current patient, when the host screen knows better than the defaults. */
  suggestions?: string[];
  minHeight?: number;
}) {
  const patient = useOpenPatient();
  const { turns, running, ask, stop } = useAgent();
  const scroll = useRef<ScrollView>(null);
  const [picking, setPicking] = useState(false);

  useEffect(() => {
    scroll.current?.scrollToEnd({ animated: true });
  }, [turns]);

  const send = (text: string) => void ask(text, patient);
  const starters = patient ? (suggestions?.length ? suggestions : PATIENT_STARTERS) : PANEL_STARTERS;

  return (
    <View style={[styles.fill, minHeight ? { minHeight, maxHeight: minHeight } : null]}>
      <View style={styles.scope}>
        <ScopeBar patient={patient} onPick={editable ? () => setPicking(true) : undefined} />
      </View>
      <ScrollView ref={scroll} contentContainerStyle={styles.thread} keyboardShouldPersistTaps="handled">
        {turns.length === 0 ? (
          <View style={styles.empty}>
            <Text color="mutedForeground">{copy.agent.empty}</Text>
            {starters.map((text) => (
              <Button key={text} title={text} variant="secondary" size="sm" onPress={() => send(text)} />
            ))}
          </View>
        ) : (
          turns.map((turn) => <TurnView key={turn.id} turn={turn} onRetry={() => send(turn.question)} />)
        )}
      </ScrollView>
      <View style={styles.composer}>
        <Composer running={running} onSend={send} onStop={stop} />
      </View>
      {editable ? <PatientPicker visible={picking} onClose={() => setPicking(false)} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scope: { paddingHorizontal: 16, paddingBottom: 4 },
  thread: { padding: 16, gap: 18, flexGrow: 1 },
  empty: { gap: 10 },
  composer: { paddingHorizontal: 12, paddingBottom: 8 },
});
