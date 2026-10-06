import { ScrollView, StyleSheet, View } from 'react-native';

import { DataState } from '@/components/shared/data-state';
import { RecordRow } from '@/components/shared/record-row';
import { Sheet } from '@/components/ui/sheet';
import { Text } from '@/components/ui/text';
import { formatDateTime } from '@/lib/format';

import { useHistory } from '../hooks/use-history';

const OP: Record<string, string> = {
  CREATE: 'Created',
  UPDATE: 'Updated',
  ARCHIVE: 'Archived',
  RESTORE: 'Restored',
};

/** The audit trail: every change to this patient's record, written by the database, never by the client. */
export function HistorySheet({
  patientId,
  visible,
  onClose,
}: {
  patientId: string;
  visible: boolean;
  onClose: () => void;
}) {
  const query = useHistory(patientId, visible);
  return (
    <Sheet visible={visible} onClose={onClose} title="Record history">
      <Text color="mutedForeground" style={styles.note}>
        Who changed what on this patient, newest first.
      </Text>
      <ScrollView contentContainerStyle={styles.body}>
        <DataState query={query} isEmpty={(data) => data.items.length === 0} empty={{ title: 'No changes recorded' }}>
          {(data) => (
            <View style={styles.list}>
              {data.items.map((entry, i) => (
                <RecordRow
                  key={`${entry.at}-${entry.record_id}-${i}`}
                  title={`${OP[entry.op] ?? entry.op} ${entry.entity.toLowerCase()} ${entry.record_id}`}
                  lines={[
                    `${formatDateTime(entry.at)} · ${entry.actor_name ?? 'System'}`,
                    entry.changed.length > 0 ? `Fields: ${entry.changed.join(', ')}` : null,
                    entry.reason ? `Reason: ${entry.reason}` : null,
                  ]}
                />
              ))}
            </View>
          )}
        </DataState>
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({ note: { marginBottom: 8 }, body: { paddingBottom: 8 }, list: { gap: 8 } });
