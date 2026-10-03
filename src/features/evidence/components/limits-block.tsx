import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import type { Limits } from '@/lib/api/types';
import { copy } from '@/lib/copy';
import { formatDate } from '@/lib/format';

function Row({ label, items }: { label: string; items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <View>
      <Text variant="caption" color="mutedForeground" bold>
        {label}
      </Text>
      <Text>{items.join('; ')}</Text>
    </View>
  );
}

/** Gaps are first-class content: what was checked, what was not, and the snapshot date. */
export function LimitsBlock({ limits }: { limits: Limits }) {
  const empty =
    !limits.checked?.length && !limits.not_checked?.length && !limits.notes?.length && !limits.snapshot_date;
  if (empty) return null;
  return (
    <Card style={styles.card}>
      <Row label={copy.gap.checked} items={limits.checked} />
      <Row label={copy.gap.notChecked} items={limits.not_checked} />
      <Row label="Notes" items={limits.notes} />
      {limits.snapshot_date ? <Row label={copy.gap.snapshot} items={[formatDate(limits.snapshot_date)]} /> : null}
    </Card>
  );
}

const styles = StyleSheet.create({ card: { gap: 8 } });
