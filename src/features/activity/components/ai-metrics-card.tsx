import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import type { AiMetrics } from '@/lib/api/types';

import { useAiMetrics } from '../hooks/use-ai-metrics';

const seconds = (value: number | null | undefined) =>
  value === null || value === undefined ? 'n/a' : `${value.toFixed(1)} s`;

function Pairs({ label, values }: { label: string; values: Record<string, number> }) {
  const entries = Object.entries(values).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) return null;
  return (
    <View style={styles.pair}>
      <Text variant="caption" color="mutedForeground" bold>
        {label}
      </Text>
      <Text variant="label">{entries.map(([key, n]) => `${key} ${n}`).join(' · ')}</Text>
    </View>
  );
}

function Figure({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <View style={styles.figure}>
      <Text variant="caption" color="mutedForeground" bold>
        {label}
      </Text>
      <Text variant="heading">{value}</Text>
      {note ? (
        <Text variant="caption" color="mutedForeground">
          {note}
        </Text>
      ) : null}
    </View>
  );
}

/** Basic observability for the assistant: volume, routes, models, tools chosen and how long people waited. */
export function AiMetricsCard() {
  const query = useAiMetrics(7);
  // A convenience card: the log below never waits for it, and it stays out of the way when empty or failing.
  if (!query.data || query.data.entries === 0) return null;
  const m: AiMetrics = query.data;
  return (
    <Card style={styles.card} accessibilityLabel={`How the assistant has performed, last ${m.days} days`}>
      <Text variant="heading" accessibilityRole="header">
        Assistant, last {m.days} days
      </Text>
      <View style={styles.figures}>
        <Figure label="Questions" value={`${m.asks}`} />
        <Figure
          label="Typical wait"
          value={seconds(m.median_seconds)}
          note={`slowest 1 in 20: ${seconds(m.p95_seconds)}`}
        />
        <Figure
          label="Changes approved"
          value={`${m.proposals_approved}`}
          note={`${m.proposals_discarded} discarded`}
        />
      </View>
      <Pairs label="Routes" values={m.by_route} />
      <Pairs label="Planner" values={m.planner_models} />
      <Pairs label="Models that wrote answers" values={m.models} />
      <Pairs label="Tools chosen" values={m.tools} />
      {m.slowest_steps.length > 0 ? (
        <View style={styles.pair}>
          <Text variant="caption" color="mutedForeground" bold>
            Slowest steps
          </Text>
          <Text variant="label">
            {m.slowest_steps.map((s) => `${s.label} ${s.average_seconds.toFixed(1)} s`).join(' · ')}
          </Text>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: 10 },
  figures: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
  figure: { gap: 2, minWidth: 90 },
  pair: { gap: 2 },
});
