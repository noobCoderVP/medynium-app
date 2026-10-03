import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { DataState } from '@/components/shared/data-state';
import { RecordRow } from '@/components/shared/record-row';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Sheet } from '@/components/ui/sheet';
import { Text } from '@/components/ui/text';
import { formatDateTime } from '@/lib/format';

import { useSavedViews } from '../hooks/use-saved-views';
import { contentFromState, stateFromContent, type ViewParams } from '../lib/view-content';
import type { TabKey } from './patient-workspace';

/**
 * Saved views. Saving is two steps and never silent: preview what will be stored, then approve it (FR-22).
 * A preview writes nothing and expires after ten minutes. A view stores the tab and its filters, never clinical data.
 */
export function ViewsSheet({
  patientId,
  visible,
  onClose,
  current,
  onOpen,
}: {
  patientId: string;
  visible: boolean;
  onClose: () => void;
  current: { tab: TabKey; params: ViewParams };
  onOpen: (view: { tab: TabKey; params: ViewParams }) => void;
}) {
  const [title, setTitle] = useState('');
  const { list, preview, save } = useSavedViews(patientId, visible);
  const pending = preview.data;

  function close() {
    preview.reset();
    onClose();
  }

  return (
    <Sheet visible={visible} onClose={close} title="Saved views">
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        {pending ? (
          <Card style={styles.card}>
            <Text variant="label">Preview: this will be saved</Text>
            <Text>Name: {pending.title}</Text>
            <Text color="mutedForeground">Screen: {stateFromContent(pending.content).tab}</Text>
            <Text variant="caption" color="mutedForeground">
              Preview expires {formatDateTime(pending.expires_at)}
            </Text>
            <View style={styles.row}>
              <Button
                title="Approve and save"
                loading={save.isPending}
                onPress={() => save.mutate(pending.preview_id)}
              />
              <Button title="Cancel" variant="ghost" onPress={() => preview.reset()} />
            </View>
            {save.isError && (
              <Text variant="label" color="destructive" accessibilityRole="alert">
                That did not save. Preview again and retry.
              </Text>
            )}
          </Card>
        ) : (
          <View style={styles.form}>
            <Input
              label="Name for this view"
              value={title}
              onChangeText={setTitle}
              placeholder="Saved view"
              maxLength={120}
            />
            <Button
              title="Preview"
              loading={preview.isPending}
              onPress={() =>
                preview.mutate(contentFromState(title.trim() || 'Saved view', current.tab, current.params))
              }
            />
            {preview.isError && (
              <Text variant="label" color="destructive" accessibilityRole="alert">
                Could not prepare a preview. Try again.
              </Text>
            )}
          </View>
        )}
        <Text variant="heading" accessibilityRole="header">
          Your saved views
        </Text>
        <DataState
          query={list}
          isEmpty={(items) => items.length === 0}
          empty={{ title: 'No saved views for this patient yet.' }}
        >
          {(items) => (
            <View style={styles.list}>
              {items.map((view) => (
                <RecordRow
                  key={view.view_id}
                  title={view.title ?? 'Saved view'}
                  lines={[`Saved ${formatDateTime(view.approved_at ?? view.created_at)}`]}
                  label={`${view.title ?? 'Saved view'}. Open.`}
                  onPress={() => {
                    onOpen(stateFromContent(view.content));
                    close();
                  }}
                />
              ))}
            </View>
          )}
        </DataState>
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: { gap: 14, paddingBottom: 8 },
  card: { gap: 8 },
  row: { gap: 8 },
  form: { gap: 10 },
  list: { gap: 8 },
});
