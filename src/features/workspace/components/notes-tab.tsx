import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { DataState } from '@/components/shared/data-state';
import { RecordRow } from '@/components/shared/record-row';
import { Sheet } from '@/components/ui/sheet';
import { Text } from '@/components/ui/text';
import { copy } from '@/lib/copy';
import { formatDate } from '@/lib/format';

import { useNote, useNotes } from '../hooks/use-patient-data';
import { PagedList } from './paged-list';

/** Notes are shown as plain text and never executed or followed as instructions (AI-07). */
export function NotesTab({ patientId }: { patientId: string }) {
  const [open, setOpen] = useState<string | null>(null);
  const query = useNotes(patientId);
  const note = useNote(patientId, open);
  return (
    <View style={styles.stack}>
      <PagedList
        query={query}
        getItems={(page) => page.items}
        empty={copy.empty.notes}
        renderItem={(item) => (
          <RecordRow
            key={item.note_id}
            title={item.title}
            lines={[formatDate(item.date), item.type]}
            label={`${item.title}, ${formatDate(item.date)}. Open note.`}
            onPress={() => setOpen(item.note_id)}
          />
        )}
      />
      <Sheet visible={!!open} onClose={() => setOpen(null)} title={note.data?.title ?? 'Note'}>
        <ScrollView contentContainerStyle={styles.body}>
          <DataState query={note}>
            {(detail) => (
              <>
                <Text variant="caption" color="mutedForeground">
                  {formatDate(detail.date)}
                  {detail.author ? ` · ${detail.author}` : ''}
                </Text>
                <Text selectable>{detail.body}</Text>
              </>
            )}
          </DataState>
        </ScrollView>
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({ stack: { gap: 12 }, body: { gap: 10, paddingBottom: 8 } });
