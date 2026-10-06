import { StyleSheet, View } from 'react-native';

import { DataState } from '@/components/shared/data-state';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useEvidenceDrawer } from '@/features/evidence';
import { copy } from '@/lib/copy';
import { formatDateTime } from '@/lib/format';

import { usePinList } from '../hooks/use-pin-list';

/** Evidence the user chose to keep. Each pin reopens its answer's evidence. */
export function PinsCard({ patientId }: { patientId: string }) {
  const { query, remove } = usePinList(patientId);
  const { open } = useEvidenceDrawer();
  return (
    <View style={styles.stack}>
      <Text variant="heading" accessibilityRole="header">
        Pinned evidence{query.data ? ` · ${query.data.items.length}` : ''}
      </Text>
      <DataState
        query={query}
        isEmpty={(list) => list.items.length === 0}
        empty={{ title: 'No pinned evidence', description: copy.empty.pins }}
      >
        {(list) => (
          <>
            {list.items.map((pin) => (
              <Card key={pin.pin_id} style={styles.item}>
                <Text variant="label">{pin.label ?? pin.evidence_id}</Text>
                {pin.note ? <Text color="mutedForeground">{pin.note}</Text> : null}
                <Text variant="caption" color="mutedForeground">
                  Pinned {formatDateTime(pin.created_at)}
                </Text>
                <View style={styles.row}>
                  <Button
                    title={`Open ${pin.evidence_id}`}
                    size="sm"
                    variant="secondary"
                    onPress={() => open({ answerId: pin.answer_id })}
                  />
                  <Button
                    title="Remove pin"
                    size="sm"
                    variant="ghost"
                    icon="trash-outline"
                    disabled={remove.isPending}
                    onPress={() => remove.mutate(pin.pin_id)}
                  />
                </View>
              </Card>
            ))}
          </>
        )}
      </DataState>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 10 },
  item: { gap: 4 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
});
