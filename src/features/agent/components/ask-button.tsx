import { useRouter } from 'expo-router';

import { Button } from '@/components/ui/button';

import { useAgent } from '../hooks/agent-context';

/**
 * A one-tap way into the assistant from another screen: asks the question for this patient and moves to the Ask tab,
 * where the steps stream in. The screen it sits on never depends on the assistant being up.
 */
export function AskButton({ label, question, patientId }: { label: string; question: string; patientId: string }) {
  const router = useRouter();
  const { ask, running } = useAgent();
  return (
    <Button
      title={label}
      size="sm"
      variant="secondary"
      icon="sparkles-outline"
      disabled={running}
      onPress={() => {
        void ask(question, patientId);
        router.navigate('/ask');
      }}
    />
  );
}
