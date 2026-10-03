import { ScrollView, StyleSheet } from 'react-native';

import { DataState } from '@/components/shared/data-state';
import { EmptyState } from '@/components/ui/empty-state';
import { Sheet } from '@/components/ui/sheet';
import { copy } from '@/lib/copy';

import type { EvidenceTarget } from '../hooks/evidence-context';
import { useEvidence } from '../hooks/use-evidence';
import { EvidenceBody } from './evidence-body';

/** The Why? drawer: the patient records, SQL and sources behind an answer. A denied answer looks like a missing one. */
export function EvidenceDrawer({ target, onClose }: { target: EvidenceTarget | null; onClose: () => void }) {
  const query = useEvidence(target?.answerId ?? null);
  return (
    <Sheet visible={!!target} onClose={onClose} title="Why this answer?">
      <ScrollView contentContainerStyle={styles.body}>
        <DataState
          query={query}
          notFound={<EmptyState title={copy.notFound.evidence.title} description={copy.notFound.evidence.body} />}
        >
          {(data) => <EvidenceBody data={data} statementId={target?.statementId ?? null} />}
        </DataState>
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({ body: { gap: 16, paddingBottom: 8 } });
