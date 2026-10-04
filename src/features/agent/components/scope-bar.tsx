import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Text } from '@/components/ui/text';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { clearScope, type OpenPatient } from '@/lib/open-patient';

/**
 * Who the assistant is answering about, always visible: "Asking about: Rahul Patel" or "All my patients". Tapping it
 * opens the picker; the cross clears back to all patients. In the patient sheet the patient is fixed, so it only labels.
 */
export function ScopeBar({ patient, onPick }: { patient: OpenPatient | null; onPick?: () => void }) {
  const theme = useTheme();
  const label = patient ? patient.name : 'All my patients';
  const body = (
    <>
      <Icon name={patient ? 'person-circle-outline' : 'people-outline'} size={20} color="primary" />
      <View style={styles.text}>
        <Text variant="caption" color="mutedForeground">
          Asking about
        </Text>
        <Text variant="label" bold numberOfLines={1}>
          {label}
        </Text>
      </View>
      {onPick ? (
        <Text variant="label" color="primary">
          Change
        </Text>
      ) : null}
    </>
  );
  const frame = [styles.bar, { backgroundColor: theme.card, borderColor: theme.border }];
  if (!onPick) {
    return (
      <View style={frame} accessible accessibilityLabel={`Asking about ${label}`}>
        {body}
      </View>
    );
  }
  return (
    <View style={styles.row}>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={`Asking about ${label}. Change patient.`}
        onPress={onPick}
        to={0.98}
        style={[...frame, styles.grow]}
      >
        {body}
      </PressableScale>
      {patient ? (
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Ask about all my patients instead"
          onPress={clearScope}
          style={[styles.clear, { backgroundColor: theme.muted, borderColor: theme.border }]}
        >
          <Icon name="close" size={20} color="foreground" />
        </PressableScale>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, alignItems: 'stretch' },
  grow: { flex: 1 },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: Radius.lg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 48,
  },
  text: { flex: 1 },
  clear: {
    width: 48,
    borderWidth: 1,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
});
