import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { AskButton } from '@/features/agent';
import { TagChip } from '@/features/evidence';
import { useTheme } from '@/hooks/use-theme';
import type { Brief } from '@/lib/api/types';

import { useBriefSummary } from '../hooks/use-brief';

/**
 * The first thing on a patient: one paragraph made from the rules, and when a model could rephrase it without adding
 * anything, a written summary beneath it. The paragraph is shown at once; the summary arrives later and never blocks.
 */
export function ClinicalBrief({
  brief,
  onReviewSafety,
  onOpenSimilar,
}: {
  brief: Brief;
  onReviewSafety: () => void;
  onOpenSimilar: () => void;
}) {
  const theme = useTheme();
  const summary = useBriefSummary(brief.patient_id, true);
  const written = summary.data?.source === 'model' ? summary.data.summary : null;
  const high = brief.attention.counts.high ?? 0;
  return (
    <Card style={styles.card}>
      <Text variant="heading" accessibilityRole="header">
        Clinical brief
      </Text>
      <Text>{brief.headline}</Text>
      <View style={styles.meta}>
        <TagChip tag="rule_check" />
        <Text variant="caption" color="mutedForeground" style={styles.metaText}>
          Made from the record by fixed rules{high ? ` · ${high} high priority` : ''}
        </Text>
      </View>
      {written ? (
        <View style={[styles.written, { backgroundColor: theme.synthSoft, borderColor: theme.synth }]}>
          <View style={styles.meta}>
            <TagChip tag="ai_synthesis" />
            <Text variant="caption" color="mutedForeground" style={styles.metaText}>
              Written from the items below; it adds nothing to them
            </Text>
          </View>
          <Text>{written}</Text>
        </View>
      ) : summary.isFetching ? (
        <Text variant="caption" color="mutedForeground" accessibilityLiveRegion="polite">
          Writing a short summary…
        </Text>
      ) : null}
      <View style={styles.actions}>
        <AskButton label="Brief me" question="Brief me on this patient" patientId={brief.patient_id} />
        <Button title="Similar" size="sm" variant="secondary" onPress={onOpenSimilar} />
        <Button title="Review safety" size="sm" icon="arrow-forward" onPress={onReviewSafety} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: 10 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  metaText: { flexShrink: 1 },
  written: { borderWidth: 1, borderRadius: 10, padding: 10, gap: 6 },
  actions: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
});
