import { FlashList } from '@shopify/flash-list';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { BrandBar } from '@/components/brand/brand-bar';
import { DataState } from '@/components/shared/data-state';
import { PatientRow } from '@/components/shared/patient-row';
import { Chips } from '@/components/ui/chips';
import { Input } from '@/components/ui/input';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { SyntheticBanner } from '@/components/synthetic-banner';
import { useTheme } from '@/hooks/use-theme';
import type { PatientListItem } from '@/lib/api/types';
import { copy } from '@/lib/copy';

import { usePatients } from '../hooks/use-patients';

/** Search, a "changed" filter and a paged list. Typing waits 300 ms before it asks the server. */
export function PatientList() {
  const theme = useTheme();
  const [text, setText] = useState('');
  const [q, setQ] = useState('');
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setQ(text.trim()), 300);
    return () => clearTimeout(id);
  }, [text]);

  const query = usePatients({ q, changed });
  const items: PatientListItem[] = query.data?.pages.flatMap((page) => page.items) ?? [];
  const total = query.data?.pages[0]?.total ?? 0;

  return (
    <View style={[styles.fill, { backgroundColor: theme.background }]}>
      <BrandBar />
      <View style={styles.head}>
        <ScreenHeader title="Patients" subtitle={query.data ? `${total} on your list` : undefined} />
        <SyntheticBanner />
        <Input
          label="Search"
          value={text}
          onChangeText={setText}
          placeholder="Name or condition"
          autoCapitalize="none"
          returnKeyType="search"
        />
        <Chips
          options={[{ value: 'changed', label: 'Changed recently' }]}
          value={changed ? 'changed' : undefined}
          onChange={(value) => setChanged(value === 'changed')}
        />
      </View>
      <View style={styles.fill}>
        <DataState query={query} isEmpty={() => items.length === 0} empty={{ title: copy.empty.patients }}>
          {() => (
            <FlashList
              data={items}
              keyExtractor={(item) => item.patient_id}
              contentContainerStyle={{ ...styles.list, paddingBottom: 24 }}
              ItemSeparatorComponent={() => <View style={styles.gap} />}
              onEndReachedThreshold={0.5}
              onEndReached={() => query.hasNextPage && !query.isFetchingNextPage && void query.fetchNextPage()}
              onRefresh={() => void query.refetch()}
              refreshing={query.isRefetching && !query.isFetchingNextPage}
              ListFooterComponent={
                query.isFetchingNextPage ? (
                  <ActivityIndicator style={styles.footer} accessibilityLabel="Loading more" />
                ) : query.isFetchNextPageError ? (
                  <Text color="destructive" style={styles.footer} onPress={() => void query.fetchNextPage()}>
                    Could not load more. Tap to retry.
                  </Text>
                ) : null
              }
              renderItem={({ item, index }) => (
                <PatientRow
                  index={index}
                  patientId={item.patient_id}
                  name={item.name}
                  age={item.age}
                  sex={item.sex}
                  detail={item.main_diagnoses.join(', ')}
                  lastEncounter={item.last_encounter}
                  flags={item.flags}
                />
              )}
            />
          )}
        </DataState>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  head: { paddingHorizontal: 16, paddingTop: 8, gap: 12, paddingBottom: 12 },
  list: { paddingHorizontal: 16 },
  gap: { height: 10 },
  footer: { padding: 16, textAlign: 'center' },
});
