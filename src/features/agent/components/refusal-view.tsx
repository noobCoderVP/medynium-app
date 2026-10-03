import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { TagChip } from '@/features/evidence';
import type { StreamRefusal } from '@/lib/api/events';
import { formatDate } from '@/lib/format';

/**
 * A calm, scoped refusal. For a prescribing request it also lists what the label documents for the patient's current
 * medicines, as retrieved-source statements only (AI-01, AI-10).
 */
export function RefusalView({ refusal }: { refusal: StreamRefusal }) {
  return (
    <View style={styles.stack} accessibilityLabel="Refusal">
      <View style={styles.row}>
        <Icon name="shield-outline" size={18} color="mutedForeground" />
        <Text style={styles.message}>{refusal.message}</Text>
      </View>
      {refusal.considerations.map((c, index) => (
        <Card key={index} style={styles.card}>
          <TagChip tag="retrieved_source" />
          <Text>{c.text}</Text>
          <Text variant="caption" color="mutedForeground">
            {[c.drug, c.section, c.title, c.version, c.effective_date ? formatDate(c.effective_date) : null]
              .filter(Boolean)
              .join(' · ')}
          </Text>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 8 },
  row: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  message: { flex: 1 },
  card: { gap: 4 },
});
