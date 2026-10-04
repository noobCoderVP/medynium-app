import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { LoadMore } from '@/components/shared/load-more';
import { DataState } from '@/components/shared/data-state';
import { Chips } from '@/components/ui/chips';
import { Reveal } from '@/components/ui/reveal';
import { ScreenHeader } from '@/components/ui/screen-header';
import { TabScreen } from '@/components/ui/tab-screen';
import { Text } from '@/components/ui/text';
import { SyntheticBanner } from '@/components/synthetic-banner';
import { useSession } from '@/features/session';
import { formatDate } from '@/lib/format';

import { usePending } from '../hooks/use-pending';
import { useReviewLab } from '../hooks/use-review-lab';
import { KINDS } from '../lib/kinds';
import { PendingRow } from './pending-row';

/** Everything waiting on the clinician across their own patients, filterable by kind. */
export function PendingView() {
  const [kind, setKind] = useState('');
  const { list, summary } = usePending(kind);
  const lab = useReviewLab();
  const { user } = useSession();
  const byKind = summary.data?.by_kind ?? {};
  const options = KINDS.map((k) => ({
    value: k.value,
    label: byKind[k.value] ? `${k.label} (${byKind[k.value]})` : k.label,
  }));
  return (
    <TabScreen
      refreshing={list.isRefetching && !list.isFetchingNextPage}
      onRefresh={() => {
        void list.refetch();
        void summary.refetch();
      }}
    >
      <ScreenHeader
        title="Pending work"
        subtitle={
          summary.data
            ? `${summary.data.total} open, ${summary.data.overdue} overdue, as of ${formatDate(summary.data.as_of)}`
            : 'Everything waiting on you'
        }
      />
      <SyntheticBanner />
      <Chips
        scroll
        label="Filter by kind"
        options={options}
        value={kind || undefined}
        onChange={(v) => setKind(v ?? '')}
      />
      {lab.message ? (
        <Text color="destructive" accessibilityRole="alert">
          {lab.message}
        </Text>
      ) : null}
      <DataState
        query={list}
        isEmpty={(data) => data.pages[0]?.total === 0}
        empty={{ title: 'Nothing is waiting on you.' }}
      >
        {(data) => (
          <View style={styles.list}>
            {data.pages
              .flatMap((page) => page.items)
              .map((item, index) => (
                <Reveal key={item.item_id} index={index}>
                  <PendingRow
                    item={item}
                    canReview={user?.role === 'DOCTOR'}
                    saving={lab.savingId === item.source_id}
                    onReview={(it) => it.source_id && lab.review({ patientId: it.patient_id, labId: it.source_id })}
                  />
                </Reveal>
              ))}
            <LoadMore
              hasNext={list.hasNextPage}
              loading={list.isFetchingNextPage}
              failed={list.isFetchNextPageError}
              onPress={() => void list.fetchNextPage()}
            />
            <Text variant="caption" color="mutedForeground" style={styles.note}>
              Items come from your own patients only.
            </Text>
          </View>
        )}
      </DataState>
    </TabScreen>
  );
}

const styles = StyleSheet.create({ list: { gap: 10 }, note: { textAlign: 'center' } });
