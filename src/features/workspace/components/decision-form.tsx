import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Chips } from '@/components/ui/chips';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { describeError } from '@/lib/api/error-message';
import type { Finding, FindingUpdate } from '@/lib/api/types';

import { useColleagues } from '../hooks/use-findings';

type Mode = 'FLAGGED' | 'DISMISSED' | 'ESCALATED';

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const today = () => new Date().toISOString().slice(0, 10);

/**
 * The decision controls for one finding. Acknowledge is one tap. Following up, dismissing and escalating each ask
 * for the one thing they need (a date, a reason, a colleague) before they can be sent, as the server requires.
 */
export function DecisionForm({
  patientId,
  finding,
  pending,
  error,
  onDecide,
}: {
  patientId: string;
  finding: Finding;
  pending: boolean;
  error: unknown;
  onDecide: (body: FindingUpdate) => void;
}) {
  const [mode, setMode] = useState<Mode | null>(null);
  const [date, setDate] = useState(today());
  const [reason, setReason] = useState('');
  const [colleague, setColleague] = useState<string | undefined>();
  const colleagues = useColleagues(patientId, mode === 'ESCALATED');
  const dateOk = DATE.test(date) && date >= today();

  const ready =
    (mode === 'FLAGGED' && dateOk) ||
    (mode === 'DISMISSED' && reason.trim().length >= 3) ||
    (mode === 'ESCALATED' && !!colleague);

  function send() {
    if (mode === 'FLAGGED') onDecide({ status: 'FLAGGED', follow_up_on: date });
    if (mode === 'DISMISSED') onDecide({ status: 'DISMISSED', reason: reason.trim() });
    if (mode === 'ESCALATED' && colleague) onDecide({ status: 'ESCALATED', assigned_to: colleague });
    setMode(null);
  }

  return (
    <View style={styles.stack}>
      <View style={styles.row}>
        {finding.status !== 'ACKNOWLEDGED' && (
          <Button
            title="Acknowledge"
            size="sm"
            disabled={pending}
            onPress={() => onDecide({ status: 'ACKNOWLEDGED' })}
          />
        )}
        <Button title="Follow up…" size="sm" variant="secondary" onPress={() => setMode('FLAGGED')} />
        <Button title="Escalate…" size="sm" variant="secondary" onPress={() => setMode('ESCALATED')} />
        {finding.status !== 'DISMISSED' && (
          <Button title="Dismiss…" size="sm" variant="secondary" onPress={() => setMode('DISMISSED')} />
        )}
        {finding.status !== 'NEW' && (
          <Button
            title="Reopen"
            size="sm"
            variant="ghost"
            disabled={pending}
            onPress={() => onDecide({ status: 'NEW' })}
          />
        )}
      </View>
      {mode === 'FLAGGED' && (
        <Input
          label="Follow up on (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
          placeholder="2026-10-20"
          keyboardType="numbers-and-punctuation"
          autoCapitalize="none"
          maxLength={10}
          error={date && !dateOk ? 'Use a date from today on, as YYYY-MM-DD.' : undefined}
        />
      )}
      {mode === 'DISMISSED' && (
        <Input label="Reason (required)" value={reason} onChangeText={setReason} multiline maxLength={500} />
      )}
      {mode === 'ESCALATED' && (
        <View style={styles.stack}>
          <Chips
            label="Escalate to"
            scroll
            options={(colleagues.data?.items ?? []).map((c) => ({
              value: c.user_id,
              label: `${c.name} (${c.role.toLowerCase()})`,
            }))}
            value={colleague}
            onChange={setColleague}
          />
          {colleagues.isError && (
            <Text variant="caption" color="destructive">
              {describeError(colleagues.error)}
            </Text>
          )}
          {colleagues.data && colleagues.data.items.length === 0 && (
            <Text variant="caption" color="mutedForeground">
              No one else has this patient. Ask an administrator to assign a colleague.
            </Text>
          )}
        </View>
      )}
      {mode && (
        <View style={styles.row}>
          <Button title="Save decision" size="sm" loading={pending} disabled={!ready} onPress={send} />
          <Button title="Cancel" size="sm" variant="ghost" onPress={() => setMode(null)} />
        </View>
      )}
      {error ? (
        <Text variant="caption" color="destructive" accessibilityRole="alert">
          {describeError(error)}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({ stack: { gap: 8 }, row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 } });
