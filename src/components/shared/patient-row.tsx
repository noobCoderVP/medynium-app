import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { FlagChips } from '@/components/shared/flag-chips';
import { Avatar } from '@/components/ui/avatar';
import { PressableCard } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Reveal } from '@/components/ui/reveal';
import { Text } from '@/components/ui/text';
import type { EncounterRef, Flag } from '@/lib/api/types';
import { formatShortDate } from '@/lib/format';

interface Props {
  patientId: string;
  name: string;
  age: number;
  sex: string;
  /** Main diagnoses, when the list has them. */
  detail?: string;
  lastEncounter: EncounterRef;
  flags: Flag[];
  /** Position in the list, for the entrance stagger. */
  index?: number;
}

/** One patient in a list. Opens the workspace. Used by the dashboard worklist and the patients list. */
export function PatientRow({ patientId, name, age, sex, detail, lastEncounter, flags, index = 0 }: Props) {
  const router = useRouter();
  const last = lastEncounter.label
    ? `${lastEncounter.label}, ${formatShortDate(lastEncounter.date)}`
    : 'No visits on record';
  return (
    <Reveal index={index}>
      <PressableCard
        label={`${name}, ${age} years, ${sex}. Last visit: ${last}. Open patient.`}
        onPress={() => router.push({ pathname: '/patient/[patientId]', params: { patientId } })}
      >
        <View style={styles.row}>
          <Avatar name={name} />
          <View style={styles.body}>
            <View style={styles.top}>
              <Text variant="heading" style={styles.name} numberOfLines={1}>
                {name}
              </Text>
              <Text variant="caption" color="mutedForeground">
                {age} · {sex}
              </Text>
            </View>
            {detail ? (
              <Text variant="caption" color="mutedForeground" numberOfLines={2}>
                {detail}
              </Text>
            ) : null}
            <Text variant="caption" color="mutedForeground">
              Last visit: {last}
            </Text>
            <FlagChips flags={flags} />
          </View>
          <Icon name="chevron-forward" size={18} color="mutedForeground" />
        </View>
      </PressableCard>
    </Reveal>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  body: { flex: 1, gap: 4 },
  top: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  name: { flex: 1 },
});
