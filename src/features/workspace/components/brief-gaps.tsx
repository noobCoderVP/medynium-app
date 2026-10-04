import { StyleSheet, View } from 'react-native';

import { Section } from '@/components/shared/section';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Text } from '@/components/ui/text';
import { AskButton } from '@/features/agent';
import { useTheme } from '@/hooks/use-theme';
import type { GapItem } from '@/lib/api/types';
import { sourceTarget, type WorkspaceTarget } from '@/lib/source-link';

/**
 * What the record does not show: usual follow-up results not seen lately, medicines with no indexed label, no allergy
 * information. Prompts to look, in the same words as a safety review's gaps; never "all clear".
 */
export function BriefGaps({
  patientId,
  items,
  onOpen,
}: {
  patientId: string;
  items: GapItem[];
  onOpen: (target: WorkspaceTarget) => void;
}) {
  const theme = useTheme();
  const frame = [styles.row, { backgroundColor: theme.card, borderColor: theme.border }];
  return (
    <Section title="Missing information" aside={items.length ? `${items.length}` : undefined}>
      {items.length === 0 ? (
        <Text color="mutedForeground">
          The fixed rules found no gaps. This is not a statement that nothing is missing.
        </Text>
      ) : (
        <>
          {items.map((gap, index) => {
            const body = (
              <>
                <Icon name="help-circle-outline" size={18} color="mutedForeground" />
                <View style={styles.main}>
                  <Text variant="label" color={gap.source ? 'primary' : 'foreground'}>
                    {gap.title}
                  </Text>
                  {gap.detail ? (
                    <Text variant="caption" color="mutedForeground">
                      {gap.detail}
                    </Text>
                  ) : null}
                </View>
              </>
            );
            return gap.source ? (
              <PressableScale
                key={`${gap.kind}-${index}`}
                accessibilityRole="button"
                accessibilityLabel={`${gap.title}. ${gap.detail ?? ''} Open the record.`}
                onPress={() => onOpen(sourceTarget(patientId, gap.source))}
                to={0.98}
                style={frame}
              >
                {body}
              </PressableScale>
            ) : (
              <View key={`${gap.kind}-${index}`} style={frame}>
                {body}
              </View>
            );
          })}
          <View style={styles.ask}>
            <AskButton label="Explain" question="What is missing from this patient's record?" patientId={patientId} />
          </View>
        </>
      )}
    </Section>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10, borderWidth: 1, borderRadius: 10, padding: 10, minHeight: 44 },
  main: { flex: 1, gap: 2 },
  ask: { alignItems: 'flex-start' },
});
