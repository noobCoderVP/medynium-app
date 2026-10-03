import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Chips } from '@/components/ui/chips';
import { Input } from '@/components/ui/input';
import { Sheet } from '@/components/ui/sheet';
import { Text } from '@/components/ui/text';
import { describeError } from '@/lib/api/error-message';
import type { ShareRequest } from '@/lib/api/types';

import { useSharePatient } from '../hooks/use-share';

type Section = NonNullable<ShareRequest['include']>[number];

const SECTIONS: { value: Section; label: string }[] = [
  { value: 'diagnoses', label: 'Diagnoses' },
  { value: 'medications', label: 'Medicines' },
  { value: 'labs', label: 'Abnormal labs' },
  { value: 'events', label: 'Recent events' },
];

/**
 * Email one summary of this patient to one recipient. The summary is built on the server from what the sender can
 * already open, the send is audited, and nothing is sent until the button is pressed.
 */
export function ShareSheet({
  patientId,
  patientName,
  visible,
  onClose,
}: {
  patientId: string;
  patientName: string;
  visible: boolean;
  onClose: () => void;
}) {
  const [to, setTo] = useState('');
  const [note, setNote] = useState('');
  const [include, setInclude] = useState<Section[]>(['diagnoses', 'medications', 'labs']);
  const share = useSharePatient(patientId);

  function close() {
    share.reset();
    onClose();
  }
  const toggle = (value: Section) =>
    setInclude((current) => (current.includes(value) ? current.filter((v) => v !== value) : [...current, value]));

  return (
    <Sheet visible={visible} onClose={close} title="Email a summary">
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        {share.isSuccess ? (
          <View style={styles.form}>
            <Text accessibilityRole="alert">Sent to {to.trim()}. The send is recorded in your activity log.</Text>
            <Button title="Done" onPress={close} />
          </View>
        ) : (
          <View style={styles.form}>
            <Text color="mutedForeground">
              Send a short summary of {patientName} to one person. Synthetic data only.
            </Text>
            <Input
              label="Send to"
              value={to}
              onChangeText={setTo}
              placeholder="name@clinic.example"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="off"
            />
            <View style={styles.chips}>
              <Text variant="label" color="mutedForeground">
                Include
              </Text>
              <View style={styles.wrap}>
                {SECTIONS.map((section) => (
                  <Chips
                    key={section.value}
                    options={[{ value: section.value, label: section.label }]}
                    value={include.includes(section.value) ? section.value : undefined}
                    onChange={() => toggle(section.value)}
                  />
                ))}
              </View>
            </View>
            <Input label="Note (optional)" value={note} onChangeText={setNote} multiline maxLength={500} />
            {share.isError && (
              <Text variant="label" color="destructive" accessibilityRole="alert">
                {describeError(share.error)}
              </Text>
            )}
            <Button
              title="Send summary"
              icon="paper-plane-outline"
              loading={share.isPending}
              disabled={to.trim().length < 3 || include.length === 0}
              onPress={() => share.mutate({ to: to.trim(), note: note.trim() || null, include })}
            />
          </View>
        )}
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: { paddingBottom: 8 },
  form: { gap: 12 },
  chips: { gap: 6 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
