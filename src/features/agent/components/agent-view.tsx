import { useEffect, useRef } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';

import { BrandBar } from '@/components/brand/brand-bar';
import { SyntheticBanner } from '@/components/synthetic-banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/use-theme';
import { copy } from '@/lib/copy';
import { useOpenPatient } from '@/lib/open-patient';

import { useAgent } from '../hooks/agent-context';
import { Composer } from './composer';
import { TurnView } from './turn-view';

const SCOPED = ['Run the safety review', 'What changed recently?', 'Show the eGFR trend'];
const UNSCOPED = [
  'Who has changed this week?',
  'Open the kidney-disease patient and run the safety review',
  'What does the metformin label say about kidney function?',
];

/**
 * The assistant. It is optional by design: it calls the same API as the rest of the app and every action it takes is a
 * button that lands on a normal screen. When it fails, only this tab shows it.
 */
export function AgentView() {
  const theme = useTheme();
  const patient = useOpenPatient();
  const { turns, running, ask, stop, clear } = useAgent();
  const scroll = useRef<ScrollView>(null);

  useEffect(() => {
    scroll.current?.scrollToEnd({ animated: true });
  }, [turns]);

  const send = (text: string) => void ask(text, patient?.id ?? null);

  return (
    <KeyboardAvoidingView style={[styles.fill, { backgroundColor: theme.background }]} behavior="padding">
      <BrandBar />
      <View style={styles.head}>
        <ScreenHeader
          title="Ask"
          actions={
            turns.length > 0 && !running ? (
              <Button title="Clear" variant="ghost" size="sm" onPress={clear} />
            ) : undefined
          }
        />
        <Badge
          label={patient ? copy.agent.scope(patient.name) : copy.agent.noScope}
          tone={patient ? 'info' : 'muted'}
        />
        <SyntheticBanner />
      </View>
      <ScrollView ref={scroll} contentContainerStyle={styles.thread} keyboardShouldPersistTaps="handled">
        {turns.length === 0 ? (
          <View style={styles.empty}>
            <Text color="mutedForeground">{copy.agent.empty}</Text>
            {(patient ? SCOPED : UNSCOPED).map((text) => (
              <Button key={text} title={text} variant="secondary" size="sm" onPress={() => send(text)} />
            ))}
          </View>
        ) : (
          turns.map((turn) => <TurnView key={turn.id} turn={turn} onRetry={() => send(turn.question)} />)
        )}
      </ScrollView>
      <View style={[styles.composer, { paddingBottom: 8 }]}>
        <Composer running={running} onSend={send} onStop={stop} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  head: { paddingHorizontal: 16, paddingTop: 8, gap: 8, paddingBottom: 8 },
  thread: { padding: 16, gap: 18, flexGrow: 1 },
  empty: { gap: 10 },
  composer: { paddingHorizontal: 12 },
});
