import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { clearScope } from '@/lib/open-patient';

import { useAgent } from '../hooks/agent-context';

const DRUG_QUESTIONS = [
  'Share details of amoxicillin',
  'Which medicines are used for high blood pressure?',
  'What is the usual adult dose of metformin?',
  'Side effects and interactions of warfarin',
];

/**
 * Ask the assistant about a medicine or about medicines for a condition (web "Ask about a drug"). It is asked with no
 * patient in scope, so it reads the indexed labels and answers with cited statements, never an instruction. A
 * convenience (rule 6): the label search on this screen does the same retrieval by hand.
 */
export function AskDrugCard() {
  const router = useRouter();
  const { ask, running } = useAgent();
  const [text, setText] = useState('');

  const send = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || running) return;
    clearScope();
    void ask(trimmed, null);
    setText('');
    router.navigate('/ask');
  };

  return (
    <Card style={styles.card} accessibilityLabel="Ask about a drug">
      <Input
        label="Ask the assistant about a drug or condition"
        value={text}
        onChangeText={setText}
        onSubmitEditing={() => send(text)}
        placeholder="For example: details of amoxicillin"
        returnKeyType="send"
      />
      <Button
        title="Ask AI"
        icon="sparkles-outline"
        disabled={running || text.trim() === ''}
        onPress={() => send(text)}
      />
      <View style={styles.examples}>
        {DRUG_QUESTIONS.map((question) => (
          <Button
            key={question}
            title={question}
            size="sm"
            variant="secondary"
            disabled={running}
            onPress={() => send(question)}
          />
        ))}
      </View>
      <Text variant="caption" color="mutedForeground">
        Answers come from the indexed US drug labels, with the source of every statement. They describe what the labels
        document; the choice of medicine and dose stays with you.
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({ card: { gap: 10 }, examples: { gap: 6, alignItems: 'flex-start' } });
