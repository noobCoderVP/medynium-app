import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { RecordRow } from '@/components/shared/record-row';
import { Badge } from '@/components/ui/badge';
import { Chips } from '@/components/ui/chips';
import { Text } from '@/components/ui/text';
import { copy } from '@/lib/copy';
import { formatDate, formatValue } from '@/lib/format';

import { useLabs } from '../hooks/use-patient-data';
import { LabTrendSheet } from './lab-trend-sheet';
import { PagedList } from './paged-list';

/** Latest value per test. Tapping a test opens its trend; `lab` pre-opens one (from the assistant's action). */
export function LabsTab({ patientId, lab, initialFlag }: { patientId: string; lab?: string; initialFlag?: string }) {
  const [flag, setFlag] = useState<string | undefined>(initialFlag);
  const [open, setOpen] = useState<string | null>(lab ?? null);
  const query = useLabs(patientId, flag);
  return (
    <View style={styles.stack}>
      <Chips options={[{ value: 'abnormal', label: 'Outside range only' }]} value={flag} onChange={setFlag} />
      <PagedList
        query={query}
        getItems={(page) => page.items}
        empty={copy.empty.labs}
        renderItem={(item) => (
          <RecordRow
            key={item.lab_id}
            title={item.test}
            lines={[
              formatDate(item.date),
              item.previous ? `Previous ${formatValue(item.previous.value, item.unit)}` : null,
            ]}
            label={`${item.test}, ${formatValue(item.value, item.unit)}${item.flag && item.flag !== 'NORMAL' ? `, ${item.flag.toLowerCase()}` : ''}. Open trend.`}
            onPress={() => setOpen(item.code)}
            right={
              <>
                <Text variant="label">{formatValue(item.value, item.unit)}</Text>
                {item.flag && item.flag !== 'NORMAL' ? (
                  <Badge label={item.flag === 'HIGH' ? 'High' : 'Low'} tone="warning" />
                ) : null}
              </>
            }
          />
        )}
      />
      <LabTrendSheet patientId={patientId} code={open} onClose={() => setOpen(null)} />
    </View>
  );
}

const styles = StyleSheet.create({ stack: { gap: 12 } });
