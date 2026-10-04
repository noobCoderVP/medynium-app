import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { RecordRow } from '@/components/shared/record-row';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import type { PendingItem } from '@/lib/api/types';
import { formatDate } from '@/lib/format';

import { ACTION_FOR, labelFor, TAB_FOR } from '../lib/kinds';

/** One waiting item. A tap opens the patient on the tab where it is dealt with. */
export function PendingRow({
  item,
  canReview,
  saving,
  onReview,
}: {
  item: PendingItem;
  /** Marking a lab reviewed is doctor-only; others still open the patient. */
  canReview: boolean;
  saving: boolean;
  onReview: (item: PendingItem) => void;
}) {
  const router = useRouter();
  return (
    <View style={styles.wrap}>
      <RecordRow
        title={item.patient_name}
        lines={[`${labelFor(item.kind)} · ${item.title}`, item.detail]}
        label={`${item.patient_name}. ${labelFor(item.kind)}. ${item.title}. ${item.overdue ? 'Overdue. ' : ''}${ACTION_FOR[item.kind]}.`}
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
      {canReview && item.kind === 'ABNORMAL_LAB' && item.source_id ? (
        <Button
          title="Mark reviewed"
          icon="checkmark-outline"
          size="sm"
          variant="secondary"
          loading={saving}
          disabled={saving}
          onPress={() => onReview(item)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({ wrap: { gap: 6 }, right: { alignItems: 'flex-end', gap: 4 } });
