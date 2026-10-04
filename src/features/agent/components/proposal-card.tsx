import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { StreamProposal } from '@/lib/api/events';
import { patientRoute } from '@/lib/source-link';

import { useProposal } from '../hooks/use-proposal';

/**
 * A change the assistant prepared. Nothing is saved until the clinician approves it here; Approve calls the same
 * service the manual screens use, as the signed-in clinician.
 */
export function ProposalCard({ proposal }: { proposal: StreamProposal }) {
  const theme = useTheme();
  const router = useRouter();
  const { state, approve, discard } = useProposal(proposal.proposal_id);
  const busy = state.phase === 'saving';
  return (
    <View
      accessibilityLabel="Change for your approval"
      style={[styles.card, { backgroundColor: theme.agentSoft, borderColor: theme.agent }]}
    >
      <View style={styles.head}>
        <Icon name="clipboard-outline" size={18} color="agent" />
        <Text variant="label" bold style={styles.title}>
          {proposal.title}
        </Text>
      </View>
      {proposal.fields.map((field) => (
        <View key={field.label} style={styles.field}>
          <Text variant="caption" color="mutedForeground" style={styles.label}>
            {field.label}
          </Text>
          <Text style={styles.value}>{field.value}</Text>
        </View>
      ))}
      {state.phase === 'saved' ? (
        <>
          <Text accessibilityLiveRegion="polite">Saved to the record.</Text>
          <Button
            title="Open"
            size="sm"
            variant="secondary"
            onPress={() => router.push(patientRoute({ patientId: state.patientId, tab: state.tab }))}
          />
        </>
      ) : state.phase === 'discarded' ? (
        <Text color="mutedForeground" accessibilityLiveRegion="polite">
          Discarded. Nothing was saved.
        </Text>
      ) : (
        <>
          <Text variant="caption" color="mutedForeground">
            Nothing is saved until you approve. You can also make this change yourself on the patient screen.
          </Text>
          {state.phase === 'failed' ? (
            <Text variant="label" color="destructive" accessibilityRole="alert">
              {state.message}
            </Text>
          ) : null}
          <View style={styles.actions}>
            <Button title="Approve and save" size="sm" onPress={() => void approve()} loading={busy} />
            <Button title="Discard" size="sm" variant="secondary" onPress={() => void discard()} disabled={busy} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: Radius.lg, padding: 12, gap: 8 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { flex: 1 },
  field: { flexDirection: 'row', gap: 8 },
  label: { width: 88 },
  value: { flex: 1 },
  actions: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
});
