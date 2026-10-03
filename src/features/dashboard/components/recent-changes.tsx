import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Section } from '@/components/shared/section';
import { PressableCard } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import type { RecentChanges } from '@/lib/api/types';
import { formatShortDate, formatValue } from '@/lib/format';

function Change({ patientId, title, detail }: { patientId: string; title: string; detail: string }) {
  const router = useRouter();
  return (
    <PressableCard
      label={`${title}. ${detail}. Open patient.`}
      onPress={() => router.push({ pathname: '/patient/[patientId]', params: { patientId } })}
    >
      <View style={styles.body}>
        <Text variant="label">{title}</Text>
        <Text variant="caption" color="mutedForeground">
          {detail}
        </Text>
      </View>
    </PressableCard>
  );
}

export function RecentChangesView({ changes }: { changes: RecentChanges }) {
  if (changes.labs.length + changes.medications.length === 0) return null;
  return (
    <Section title="What changed">
      {changes.labs.map((lab) => (
        <Change
          key={`${lab.patient_id}-${lab.test}-${lab.date}`}
          patientId={lab.patient_id}
          title={`${lab.name}: ${lab.test}`}
          detail={`${formatValue(lab.latest, lab.unit)}${lab.previous === null ? '' : ` (was ${formatValue(lab.previous)})`}${lab.abnormal ? `, ${lab.abnormal.toLowerCase()}` : ''} · ${formatShortDate(lab.date)}`}
        />
      ))}
      {changes.medications.map((med) => (
        <Change
          key={`${med.patient_id}-${med.drug}-${med.date}`}
          patientId={med.patient_id}
          title={`${med.name}: ${med.drug}`}
          detail={`${med.change} · ${formatShortDate(med.date)}`}
        />
      ))}
    </Section>
  );
}

const styles = StyleSheet.create({ body: { gap: 2 } });
