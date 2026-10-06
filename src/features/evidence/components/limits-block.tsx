import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

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

/** Gaps are first-class content: what was checked, what was not, and the snapshot date.
 * Collapsed by default so the answer leads; one tap opens it. */
export function LimitsBlock({ limits }: { limits: Limits }) {
  const [open, setOpen] = useState(false);
  const empty =
    !limits.checked?.length && !limits.not_checked?.length && !limits.notes?.length && !limits.snapshot_date;
  if (empty) return null;
  return (
    <Card style={styles.card}>
      <Pressable
        onPress={() => setOpen((v) => !v)}
        accessibilityRole="button"
        accessibilityLabel={copy.gap.checked}
        accessibilityState={{ expanded: open }}
        style={styles.toggle}
      >
        <Text variant="caption" color="mutedForeground" bold>
          {open ? '▾ ' : '▸ '}
          {copy.gap.checked}
        </Text>
      </Pressable>
      {open ? (
        <>
          {limits.checked?.length ? <Text>{limits.checked.join('; ')}</Text> : null}
          <Row label={copy.gap.notChecked} items={limits.not_checked} />
          <Row label="Notes" items={limits.notes} />
          {limits.snapshot_date ? <Row label={copy.gap.snapshot} items={[formatDate(limits.snapshot_date)]} /> : null}
        </>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({ card: { gap: 8 }, toggle: { minHeight: 44, justifyContent: 'center' } });
