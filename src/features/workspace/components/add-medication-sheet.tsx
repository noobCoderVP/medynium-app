import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet } from '@/components/ui/sheet';
import { Text } from '@/components/ui/text';
import { ApiError } from '@/lib/api/errors';
import { describeError } from '@/lib/api/error-message';

import { useAddMedication } from '../hooks/use-add-medication';

const EMPTY = { description: '', strength_text: '', dose_text: '', start_date: '' };
const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Add a medicine to this patient's list (doctors). The server matches the name to a known drug, brand names included. */
export function AddMedicationSheet({
  patientId,
  visible,
  onClose,
}: {
  patientId: string;
  visible: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState(EMPTY);
  const { mutation, reset } = useAddMedication(patientId);
  const set = (field: keyof typeof EMPTY) => (value: string) => setForm((f) => ({ ...f, [field]: value }));
  const startOk = !form.start_date || DATE.test(form.start_date);

  function close() {
    reset();
    setForm(EMPTY);
    onClose();
  }

  return (
    <Sheet visible={visible} onClose={close} title="Add a medicine">
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        {mutation.isSuccess ? (
          <View style={styles.form}>
            <Text accessibilityRole="alert">Added to the record.</Text>
            <Button title="Done" onPress={close} />
          </View>
        ) : (
          <View style={styles.form}>
            <Text color="mutedForeground">Brand or generic name. Synthetic data only.</Text>
            <Input
              label="Medicine"
              value={form.description}
              onChangeText={set('description')}
              placeholder="for example Glycomet 500"
              maxLength={200}
            />
            <Input label="Strength (optional)" value={form.strength_text} onChangeText={set('strength_text')} />
            <Input label="Dose (optional)" value={form.dose_text} onChangeText={set('dose_text')} />
            <Input
              label="Start date (optional, YYYY-MM-DD)"
              value={form.start_date}
              onChangeText={set('start_date')}
              keyboardType="numbers-and-punctuation"
              autoCapitalize="none"
              maxLength={10}
              error={startOk ? undefined : 'Use YYYY-MM-DD.'}
            />
            {mutation.isError && (
              <Text variant="label" color="destructive" accessibilityRole="alert">
                {mutation.error instanceof ApiError && mutation.error.status === 403
                  ? 'Only doctors can change the record.'
                  : describeError(mutation.error)}
              </Text>
            )}
            <Button
              title="Add medicine"
              icon="add-circle-outline"
              loading={mutation.isPending}
              disabled={!form.description.trim() || !startOk}
              onPress={() =>
                mutation.mutate({
                  description: form.description.trim(),
                  strength_text: form.strength_text.trim() || null,
                  dose_text: form.dose_text.trim() || null,
                  start_date: form.start_date || null,
                })
              }
            />
          </View>
        )}
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({ body: { paddingBottom: 8 }, form: { gap: 12 } });
