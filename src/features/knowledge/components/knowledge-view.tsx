import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { DataState } from '@/components/shared/data-state';
import { Button } from '@/components/ui/button';
import { Chips } from '@/components/ui/chips';
import { Input } from '@/components/ui/input';
import { ScreenHeader } from '@/components/ui/screen-header';
import { TabScreen } from '@/components/ui/tab-screen';
import { Text } from '@/components/ui/text';
import { AskDrugCard } from '@/features/agent';
import { copy } from '@/lib/copy';
import { formatDate } from '@/lib/format';

import { useKnowledgeSearch, useKnowledgeStatus } from '../hooks/use-knowledge';
import { CitationCard } from './citation-card';

/** Search the indexed drug labels. Results are quoted sources with their version and date, never summaries. */
export function KnowledgeView({ back = false, initialQuery = '' }: { back?: boolean; initialQuery?: string }) {
  const [text, setText] = useState(initialQuery);
  const [q, setQ] = useState(initialQuery.trim());
  const [drug, setDrug] = useState<string | undefined>();
  const status = useKnowledgeStatus();
  const search = useKnowledgeSearch(q, drug);
  const submit = () => setQ(text.trim());

  return (
    <TabScreen back={back}>
      <ScreenHeader
        title="Knowledge"
        subtitle={
          status.data
            ? `${status.data.document_count} documents, ${status.data.drug_count} drugs${status.data.snapshot_date ? `, snapshot ${formatDate(status.data.snapshot_date)}` : ''}`
            : undefined
        }
      />
      <AskDrugCard />
      <Input
        label="Search drug labels"
        value={text}
        onChangeText={setText}
        onSubmitEditing={submit}
        placeholder="For example: metformin kidney function"
        returnKeyType="search"
        autoCapitalize="none"
      />
      {status.data && status.data.drugs.length > 0 && (
        <Chips
          scroll
          options={status.data.drugs.map((d) => ({ value: d, label: d }))}
          value={drug}
          onChange={setDrug}
        />
      )}
      <Button title="Search" icon="search-outline" onPress={submit} disabled={text.trim().length < 2} />
      {q.length >= 2 && (
        <DataState
          query={search}
          isEmpty={(data) => data.items.length === 0}
          empty={{ title: search.data?.message ?? copy.empty.knowledge }}
        >
          {(data) => (
            <View style={styles.list}>
              {data.conflicts && data.conflicts.length > 0 && (
                <Text variant="label" color="warning">
                  Sources disagree: {data.conflicts.join('; ')}
                </Text>
              )}
              {data.items.map((item) => (
                <CitationCard key={item.chunk_id} item={item} />
              ))}
            </View>
          )}
        </DataState>
      )}
    </TabScreen>
  );
}

const styles = StyleSheet.create({ list: { gap: 10 } });
