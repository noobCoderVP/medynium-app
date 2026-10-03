import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/use-theme';
import type { PatientEvidence, SourceEvidence, SqlEvidence } from '@/lib/api/types';
import { formatDate } from '@/lib/format';

function Frame({ highlighted, children }: { highlighted?: boolean; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <Card style={[styles.card, highlighted && { borderColor: theme.foreground, borderWidth: 2 }]}>{children}</Card>
  );
}

function PinButton({ pinned, onPin }: { pinned: boolean; onPin?: () => void }) {
  if (!onPin && !pinned) return null;
  return (
    <Button
      title={pinned ? 'Pinned' : 'Pin'}
      size="sm"
      variant="secondary"
      disabled={pinned}
      onPress={onPin}
      icon="pin-outline"
    />
  );
}

interface ItemProps<T> {
  item: T;
  highlighted: boolean;
  pinned: boolean;
  onPin?: () => void;
}

export function PatientRecordItem({ item, highlighted, pinned, onPin }: ItemProps<PatientEvidence>) {
  return (
    <Frame highlighted={highlighted}>
      <Text variant="caption" color="mutedForeground">
        {item.evidence_id} · {item.record_type}
        {item.date ? ` · ${formatDate(item.date)}` : ''}
        {highlighted ? ' · supports the selected statement' : ''}
      </Text>
      <Text>{item.value}</Text>
      <Text variant="caption" color="mutedForeground">
        Table {item.table}
        {item.record_id ? `, record ${item.record_id}` : ''}
      </Text>
      <PinButton pinned={pinned} onPin={onPin} />
    </Frame>
  );
}

export function SourceItem({ item, highlighted, pinned, onPin }: ItemProps<SourceEvidence>) {
  return (
    <Frame highlighted={highlighted}>
      <Text variant="caption" color="mutedForeground">
        {item.evidence_id} · {item.source}
        {highlighted ? ' · supports the selected statement' : ''}
      </Text>
      <Text variant="label">
        {item.title}, {item.section}
      </Text>
      <Text variant="caption" color="mutedForeground">
        {[
          item.version ? `Version ${item.version}` : null,
          item.effective_date ? `effective ${formatDate(item.effective_date)}` : null,
          item.retrieved_date ? `retrieved ${formatDate(item.retrieved_date)}` : null,
        ]
          .filter(Boolean)
          .join(' · ')}
      </Text>
      <Text selectable>{item.text}</Text>
      <PinButton pinned={pinned} onPin={onPin} />
    </Frame>
  );
}

export function SqlItem({ item }: { item: SqlEvidence }) {
  return (
    <Card style={styles.card}>
      <Text variant="caption" color="mutedForeground">
        {item.sql_id} · {item.role} · {item.row_count} rows
      </Text>
      <View>
        <Text selectable variant="caption" style={styles.mono}>
          {item.text}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({ card: { gap: 6 }, mono: { fontFamily: 'monospace' } });
