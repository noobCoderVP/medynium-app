import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';

import { BrandBar } from '@/components/brand/brand-bar';
import { SyntheticBanner } from '@/components/synthetic-banner';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { useTheme } from '@/hooks/use-theme';

import { useAgent } from '../hooks/agent-context';
import { AgentChat } from './agent-chat';

/**
 * The assistant. It is optional by design: it calls the same API as the rest of the app and every action it takes is a
 * button that lands on a normal screen. When it fails, only this tab shows it.
 */
export function AgentView() {
  const theme = useTheme();
  const { turns, running, clear } = useAgent();
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
        <SyntheticBanner />
      </View>
      <AgentChat editable />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  head: { paddingHorizontal: 16, paddingTop: 8, gap: 8, paddingBottom: 8 },
});
