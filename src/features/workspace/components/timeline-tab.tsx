import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { RecordRow } from '@/components/shared/record-row';
import { Chips } from '@/components/ui/chips';
import { Text } from '@/components/ui/text';
import { copy } from '@/lib/copy';
import { formatDate } from '@/lib/format';

import { useTimeline } from '../hooks/use-patient-data';
import { PagedList } from './paged-list';

const TYPES = [
  { value: 'ENCOUNTER', label: 'Visits' },
  { value: 'DIAGNOSIS', label: 'Diagnoses' },
  { value: 'MEDICATION_START,MEDICATION_CHANGE', label: 'Medicines' },
  { value: 'LAB_PANEL', label: 'Labs' },
  { value: 'CLAIM', label: 'Claims' },
  { value: 'NOTE', label: 'Notes' },
];

/** Newest first. `from` and `to` arrive from the assistant's "show timeline" action and can be cleared by hand. */
export function TimelineTab({
  patientId,
  from,
  to,
  onClearRange,
}: {
  patientId: string;
  from?: string;
  to?: string;
  onClearRange: () => void;
}) {
  const [types, setTypes] = useState<string | undefined>();
  const query = useTimeline(patientId, { types, from, to });
  return (
    <View style={styles.stack}>
      <Chips scroll options={TYPES} value={types} onChange={setTypes} />
      {(from || to) && (
        <View style={styles.range}>
          <Text variant="caption" color="mutedForeground">
            Showing {formatDate(from)} to {formatDate(to)}
          </Text>
          <Text variant="label" onPress={onClearRange} accessibilityRole="button">
            Clear dates
          </Text>
        </View>
      )}
      <PagedList
        query={query}
        getItems={(page) => page.items}
        empty={copy.empty.timeline}
        renderItem={(event) => (
          <RecordRow key={event.event_id} title={event.title} lines={[formatDate(event.date), event.summary]} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
  range: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 44 },
});
