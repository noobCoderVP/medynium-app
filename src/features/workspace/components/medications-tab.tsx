import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { RecordRow } from '@/components/shared/record-row';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Chips } from '@/components/ui/chips';
import { useIsDoctor } from '@/features/session';
import { copy } from '@/lib/copy';
import { formatDate } from '@/lib/format';

import { useMedications } from '../hooks/use-patient-data';
import { AddMedicationSheet } from './add-medication-sheet';
import { PagedList } from './paged-list';

export function MedicationsTab({ patientId }: { patientId: string }) {
  const [status, setStatus] = useState<'active' | 'all'>('active');
  const query = useMedications(patientId, status);
  const isDoctor = useIsDoctor();
  const [adding, setAdding] = useState(false);
  return (
    <View style={styles.stack}>
      {isDoctor && (
        <>
          <Button title="Add medicine" icon="add-circle-outline" variant="secondary" onPress={() => setAdding(true)} />
          <AddMedicationSheet patientId={patientId} visible={adding} onClose={() => setAdding(false)} />
        </>
      )}
      <Chips
        fill
        options={[
          { value: 'active', label: 'Active' },
          { value: 'all', label: 'All' },
        ]}
        value={status}
        onChange={(value) => setStatus(value ?? 'active')}
      />
      <PagedList
        query={query}
        getItems={(page) => page.items}
        empty={copy.empty.medications}
        renderItem={(med) => (
          <RecordRow
            key={med.medication_id}
            title={med.drug}
            lines={[
              [med.dose, med.strength].filter(Boolean).join(' · ') || null,
              med.started ? `Started ${formatDate(med.started)}` : null,
              med.stopped ? `Stopped ${formatDate(med.stopped)}` : null,
              med.change ? `${med.change}${med.last_change_date ? `, ${formatDate(med.last_change_date)}` : ''}` : null,
            ]}
            right={med.in_knowledge_base ? <Badge label="Label indexed" tone="info" /> : undefined}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({ stack: { gap: 12 } });
