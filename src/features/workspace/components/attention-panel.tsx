import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Text } from '@/components/ui/text';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Overview } from '@/lib/api/types';
import { formatShortDate, formatValue } from '@/lib/format';

import { abnormalLabs, labDelta, refRange } from '../lib/abnormal-labs';

const MAX_ROWS = 4;

/**
 * The clinical safety panel: every lab outside its reference range with its range and movement, and the way into
 * the safety review. The reasons come only from recorded values, never from a model. Renders nothing when no
 * result is flagged.
 */
export function AttentionPanel({
  patient,
  onReviewSafety,
  onOpenLab,
  onAllFlagged,
}: {
  patient: Overview;
  onReviewSafety: () => void;
  onOpenLab: (code: string) => void;
  onAllFlagged: () => void;
}) {
  const theme = useTheme();
  const all = abnormalLabs(patient.latest_labs);
  if (all.length === 0) return null;
  const rows = all.slice(0, MAX_ROWS);
  return (
    <View
      accessibilityLabel="Needs attention"
      style={[styles.panel, { backgroundColor: theme.criticalSoft, borderColor: theme.critical }]}
    >
      <View style={styles.head}>
        <Icon name="alert-circle" size={20} color="critical" />
        <Text variant="label" bold color="critical" style={styles.title} accessibilityRole="header">
          {all.length} {all.length === 1 ? 'item needs' : 'items need'} attention
        </Text>
      </View>
      {rows.map((lab) => {
        const delta = labDelta(lab);
        const range = refRange(lab);
        return (
          <PressableScale
            key={lab.lab_id}
            accessibilityRole="button"
            accessibilityLabel={`${lab.test} ${formatValue(lab.value, lab.unit)}, ${lab.flag === 'HIGH' ? 'high' : 'low'}${
              delta ? `, ${delta.text} since previous` : ''
            }. Open trend.`}
            onPress={() => onOpenLab(lab.code)}
            to={0.98}
            style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]}
          >
            <View style={styles.rowTop}>
              <Text variant="label" bold style={styles.test}>
                {lab.test}
              </Text>
              <Text variant="label" bold color="critical">
                {formatValue(lab.value, lab.unit)} {lab.flag === 'HIGH' ? '↑ High' : '↓ Low'}
              </Text>
            </View>
            <Text variant="caption" color="mutedForeground">
              {formatShortDate(lab.date)}
              {range ? ` · Ref ${range}` : ''}
              {lab.previous ? ` · ${delta?.arrow ?? '→'} from ${formatValue(lab.previous.value)}` : ''}
            </Text>
          </PressableScale>
        );
      })}
      {all.length > rows.length && (
        <Text variant="caption" color="mutedForeground" onPress={onAllFlagged} accessibilityRole="button">
          +{all.length - rows.length} more flagged results
        </Text>
      )}
      <Button title="Review safety" icon="arrow-forward" size="sm" onPress={onReviewSafety} />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { borderWidth: 1, borderRadius: Radius.lg, padding: 12, gap: 8 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { flex: 1 },
  row: { borderWidth: 1, borderRadius: Radius.md, paddingHorizontal: 10, paddingVertical: 8, gap: 2, minHeight: 44 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  test: { flexShrink: 1 },
});
