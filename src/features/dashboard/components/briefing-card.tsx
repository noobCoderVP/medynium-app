import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ErrorPanel } from '@/components/shared/data-state';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { formatDate } from '@/lib/format';

import { useBriefing } from '../hooks/use-dashboard';

/** "Brief me": rules over the dashboard data, shown on request only. States the source honestly (no model call). */
export function BriefingCard() {
  const router = useRouter();
  const briefing = useBriefing();

  if (briefing.isIdle) {
    return <Button title="Brief me" icon="newspaper-outline" variant="secondary" onPress={() => briefing.mutate()} />;
  }
  if (briefing.isPending) return <Button title="Preparing briefing" loading variant="secondary" />;
  if (briefing.isError) return <ErrorPanel error={briefing.error} onRetry={() => briefing.mutate()} />;

  const data = briefing.data;
  return (
    <Card style={styles.card}>
      <View style={styles.head}>
        <Text variant="heading" accessibilityRole="header">
          Briefing · {formatDate(data.as_of)}
        </Text>
        <Button title="Close" size="sm" variant="ghost" onPress={() => briefing.reset()} />
      </View>
      <Text variant="caption" color="mutedForeground">
        Built from your dashboard data with rules, no model call.
      </Text>
      {data.items.length === 0 ? (
        <Text color="mutedForeground">{data.empty_note ?? 'Nothing new to report.'}</Text>
      ) : (
        data.items.map((item) => (
          <Button
            key={`${item.patient_id}-${item.text}`}
            title={`${item.name}: ${item.text}`}
            variant="ghost"
            onPress={() => router.push({ pathname: '/patient/[patientId]', params: { patientId: item.patient_id } })}
          />
        ))
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: 8 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
