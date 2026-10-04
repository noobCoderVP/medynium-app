import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { RecordRow } from '@/components/shared/record-row';
import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import type { PendingItem } from '@/lib/api/types';
import { formatDate } from '@/lib/format';

import { labelFor, TAB_FOR } from '../lib/kinds';

/** One waiting item. A tap opens the patient on the tab where it is dealt with. */
export function PendingRow({ item }: { item: PendingItem }) {
  const router = useRouter();
  return (
    <RecordRow
      title={item.patient_name}
      lines={[`${labelFor(item.kind)} · ${item.title}`, item.detail]}
      label={`${item.patient_name}. ${labelFor(item.kind)}. ${item.title}. ${item.overdue ? 'Overdue. ' : ''}Open patient.`}
      onPress={() =>
        router.push({
          pathname: '/patient/[patientId]',
          params: { patientId: item.patient_id, tab: TAB_FOR[item.kind] },
        })
      }
      right={
        <View style={styles.right}>
          {item.overdue ? <Badge label="Overdue" tone="destructive" /> : null}
          {item.due_date ? (
            <Text variant="caption" color="mutedForeground">
              Due {formatDate(item.due_date)}
            </Text>
          ) : null}
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({ right: { alignItems: 'flex-end', gap: 4 } });
