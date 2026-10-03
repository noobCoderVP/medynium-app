import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { DataState } from '@/components/shared/data-state';
import { LoadMore } from '@/components/shared/load-more';
import { RecordRow } from '@/components/shared/record-row';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { ScreenHeader } from '@/components/ui/screen-header';
import { copy } from '@/lib/copy';
import { formatDateTime } from '@/lib/format';

import { useAudit } from '../hooks/use-audit';

const TONE: Record<string, 'success' | 'warning' | 'destructive' | 'muted'> = {
  OK: 'success',
  SUCCESS: 'success',
  DENIED: 'warning',
  REFUSED: 'warning',
  ERROR: 'destructive',
};

/** What the assistant and you did, and when. Denials are listed too. */
export function ActivityView() {
  const router = useRouter();
  const query = useAudit();
  return (
    <Screen header={false} refreshing={query.isRefetching} onRefresh={() => void query.refetch()}>
      <View style={styles.back}>
        <Button title="Back" icon="chevron-back" variant="ghost" size="sm" onPress={() => router.back()} />
      </View>
      <ScreenHeader title="Activity" subtitle="Every question, action and denial is recorded." />
      <DataState
        query={query}
        isEmpty={(data) => data.pages.every((page) => page.items.length === 0)}
        empty={{ title: copy.empty.audit }}
      >
        {(data) => (
          <View style={styles.list}>
            {data.pages
              .flatMap((page) => page.items)
              .map((row) => (
                <RecordRow
                  key={row.audit_id}
                  title={row.question ?? row.action}
                  lines={[
                    formatDateTime(row.occurred_at),
                    [row.action, row.route, row.model ?? (row.route ? copy.agent.noModel : null)]
                      .filter(Boolean)
                      .join(' · '),
                    row.patient_id ? `Patient ${row.patient_id}` : null,
                  ]}
                  right={<Badge label={row.outcome} tone={TONE[row.outcome.toUpperCase()] ?? 'muted'} />}
                />
              ))}
            <LoadMore
              hasNext={query.hasNextPage}
              loading={query.isFetchingNextPage}
              failed={query.isFetchNextPageError}
              onPress={() => void query.fetchNextPage()}
            />
          </View>
        )}
      </DataState>
    </Screen>
  );
}

const styles = StyleSheet.create({ list: { gap: 10 }, back: { alignItems: 'flex-start', marginLeft: -12 } });
