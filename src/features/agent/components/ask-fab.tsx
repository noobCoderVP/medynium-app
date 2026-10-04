import { useState } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Sheet } from '@/components/ui/sheet';
import { useTheme } from '@/hooks/use-theme';

import { AgentChat } from './agent-chat';

/**
 * The assistant from inside a patient: a button on every tab that opens the same conversation as a sheet, already
 * about this patient, so the record stays visible behind it. The patient is fixed here; change it from the Ask tab.
 */
export function AskFab({ suggestions }: { suggestions?: string[] }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const [open, setOpen] = useState(false);
  return (
    <>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Ask the assistant about this patient"
        onPress={() => setOpen(true)}
        style={[styles.fab, { backgroundColor: theme.primary, bottom: insets.bottom + 16 }]}
      >
        <Icon name="sparkles" size={24} color="primaryForeground" />
      </PressableScale>
      <Sheet visible={open} onClose={() => setOpen(false)} title="Ask about this patient">
        <AgentChat editable={false} suggestions={suggestions} minHeight={Math.round(height * 0.62)} />
      </Sheet>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
});
