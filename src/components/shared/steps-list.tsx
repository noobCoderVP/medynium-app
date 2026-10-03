import { StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { StreamStep } from '@/lib/api/events';

const ICON: Record<StreamStep['status'], IconName> = {
  running: 'time-outline',
  done: 'checkmark-circle-outline',
  failed: 'close-circle-outline',
};

/** What the assistant is doing, step by step, as text with an icon (never colour alone). */
export function StepsList({ steps }: { steps: StreamStep[] }) {
  if (steps.length === 0) return null;
  return (
    <View style={styles.list} accessibilityLiveRegion="polite">
      {steps.map((step) => (
        <View
          key={step.step_id}
          style={styles.row}
          accessible
          accessibilityLabel={`${step.label}, ${step.status}${step.detail ? `, ${step.detail}` : ''}`}
        >
          <Icon
            name={ICON[step.status]}
            size={16}
            color={step.status === 'failed' ? 'destructive' : 'mutedForeground'}
          />
          <Text variant="caption" color="mutedForeground" style={styles.text}>
            {step.label}
            {step.detail ? ` · ${step.detail}` : ''}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  text: { flex: 1 },
});
