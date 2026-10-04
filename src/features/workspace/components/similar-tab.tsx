import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { DataState } from '@/components/shared/data-state';
import { Card, PressableCard } from '@/components/ui/card';
import { Reveal } from '@/components/ui/reveal';
import { ListSkeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import type { SimilarPatient } from '@/lib/api/types';
import { formatNumber } from '@/lib/format';

import { useSimilar } from '../hooks/use-patient-data';

function Match({ item }: { item: SimilarPatient }) {
  const router = useRouter();
  const percent = Math.round(item.score * 100);
  return (
    <PressableCard
      label={`${item.name}, match ${percent} percent. Open patient.`}
      onPress={() => router.push({ pathname: '/patient/[patientId]', params: { patientId: item.patient_id } })}
    >
      <View style={styles.match}>
        <View style={styles.top}>
          <Text variant="heading" style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <Text variant="label" bold>
            Match {percent}%
          </Text>
        </View>
        <Text variant="caption" color="mutedForeground">
          {item.patient_id}
          {item.age !== null ? ` · ${item.age}` : ''}
          {item.sex ? ` · ${item.sex}` : ''}
        </Text>
        {item.why.map((reason) => (
          <Text key={reason} variant="caption">
            • {reason}
          </Text>
        ))}
        {item.lab_comparison.length > 0 && (
          <View style={styles.labs}>
            {item.lab_comparison.map((lab) => (
              <Text key={lab.test} variant="caption" color="mutedForeground">
                {lab.test}: this patient {formatNumber(lab.this_value)} {lab.unit ?? ''}
                {lab.this_flag ? ` (${lab.this_flag})` : ''}, match {formatNumber(lab.other_value)} {lab.unit ?? ''}
                {lab.other_flag ? ` (${lab.other_flag})` : ''}
              </Text>
            ))}
          </View>
        )}
      </View>
    </PressableCard>
  );
}

/** Patients with a real overlap in diagnoses, medicines, labs or age among the clinician's own patients. */
export function SimilarTab({ patientId }: { patientId: string }) {
  const query = useSimilar(patientId);
  return (
    <DataState
      query={query}
      skeleton={<ListSkeleton rows={3} />}
      isEmpty={(data) => data.items.length === 0}
      empty={{
        title: 'No similar patients found.',
        description: 'Only patients with a real overlap are listed; the list is never padded.',
      }}
    >
      {(data) => (
        <View style={styles.list}>
          {data.note ? (
            <Card accessibilityRole="alert">
              <Text variant="caption" color="mutedForeground">
                {data.note}
              </Text>
            </Card>
          ) : null}
          {data.items.map((item, index) => (
            <Reveal key={item.patient_id} index={index}>
              <Match item={item} />
            </Reveal>
          ))}
          <Text variant="caption" color="mutedForeground">
            {data.disclaimer}
          </Text>
        </View>
      )}
    </DataState>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
  match: { gap: 4 },
  top: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  name: { flex: 1 },
  labs: { gap: 2, marginTop: 4 },
});
