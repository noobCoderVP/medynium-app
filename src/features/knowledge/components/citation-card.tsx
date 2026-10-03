import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { TagChip } from '@/features/evidence';
import type { Citation } from '@/lib/api/types';
import { formatDate } from '@/lib/format';

/** One retrieved label section: where it came from, a snippet, and the full text on request. */
export function CitationCard({ item }: { item: Citation }) {
  const [open, setOpen] = useState(false);
  const meta = [
    item.drug,
    item.version ? `Version ${item.version}` : null,
    item.effective_date ? `effective ${formatDate(item.effective_date)}` : null,
    item.retrieved_date ? `retrieved ${formatDate(item.retrieved_date)}` : null,
    item.page ? `page ${item.page}` : null,
  ]
    .filter(Boolean)
    .join(' · ');
  return (
    <Card style={styles.card}>
      <TagChip tag="retrieved_source" />
      <Text variant="label">
        {item.title}, {item.section}
      </Text>
      <Text variant="caption" color="mutedForeground">
        {item.source}
        {meta ? ` · ${meta}` : ''}
      </Text>
      {item.conflict ? (
        <Text variant="caption" color="warning">
          Another source disagrees on this section.
        </Text>
      ) : null}
      <Text selectable>{open ? item.text : item.snippet}</Text>
      <View>
        <Button
          title={open ? 'Show less' : 'Show full text'}
          size="sm"
          variant="ghost"
          onPress={() => setOpen((v) => !v)}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({ card: { gap: 6 } });
