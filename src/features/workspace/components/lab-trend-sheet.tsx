import { ScrollView, StyleSheet, View } from 'react-native';

import { DataState } from '@/components/shared/data-state';
import { Sheet } from '@/components/ui/sheet';
import { Text } from '@/components/ui/text';
import { formatDate, formatValue } from '@/lib/format';

import { useLabTrend } from '../hooks/use-patient-data';
import { LabChart } from './lab-chart';

export function LabTrendSheet({
  patientId,
  code,
  onClose,
}: {
  patientId: string;
  code: string | null;
  onClose: () => void;
}) {
  const query = useLabTrend(patientId, code);
  return (
    <Sheet visible={!!code} onClose={onClose} title={query.data?.test ?? 'Lab trend'}>
      <ScrollView contentContainerStyle={styles.body}>
        <DataState
          query={query}
          isEmpty={(trend) => trend.points.length === 0}
          empty={{ title: 'No values on record.' }}
        >
          {(trend) => (
            <>
              <LabChart trend={trend} />
              <View style={styles.table}>
                {[...trend.points].reverse().map((point) => (
                  <View key={point.lab_id} style={styles.line}>
                    <Text color="mutedForeground">{formatDate(point.date)}</Text>
                    <Text bold>{formatValue(point.value, trend.unit)}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </DataState>
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: { gap: 12, paddingBottom: 8 },
  table: { gap: 6 },
  line: { flexDirection: 'row', justifyContent: 'space-between' },
});
