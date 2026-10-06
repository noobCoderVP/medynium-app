import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Chips } from '@/components/ui/chips';
import { Input } from '@/components/ui/input';
import { Sheet } from '@/components/ui/sheet';
import { Text } from '@/components/ui/text';
import { describeError } from '@/lib/api/error-message';
import { ApiError } from '@/lib/api/errors';
import { patientRoute } from '@/lib/source-link';

import { useCreatePatient } from '../hooks/use-create-patient';

const EMPTY = { full_name: '', birth_date: '', city: '', state: '', phone: '' };
const DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Register a new patient (doctors). The server checks the fields, warns about a possible duplicate (same name and
 * birth date) and assigns the patient to the signed-in doctor. Synthetic data only: do not enter real people.
 */
export function NewPatientSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY);
  const [sex, setSex] = useState<'M' | 'F'>('F');
  const [confirmDuplicate, setConfirmDuplicate] = useState(false);
  const { mutation, duplicate, reset } = useCreatePatient();
  const set = (field: keyof typeof EMPTY) => (value: string) => setForm((f) => ({ ...f, [field]: value }));
  const dobOk = DATE.test(form.birth_date) && form.birth_date <= new Date().toISOString().slice(0, 10);

  function close() {
    reset();
    setForm(EMPTY);
    setSex('F');
    setConfirmDuplicate(false);
    onClose();
  }

  function submit() {
    mutation.mutate({
      full_name: form.full_name.trim(),
      birth_date: form.birth_date,
      sex,
      city: form.city.trim() || null,
      state: form.state.trim() || null,
      phone: form.phone.trim() || null,
      confirm_duplicate: confirmDuplicate,
    });
  }

  const created = mutation.data;
  return (
    <Sheet visible={visible} onClose={close} title="New patient">
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        {created ? (
          <View style={styles.form}>
            <Text accessibilityRole="alert">Registered {created.patient_id}.</Text>
            <Text color="mutedForeground">
              The record opens now; summaries and similar-patient search catch up within seconds.
            </Text>
            <Button
              title="Open the record"
              onPress={() => {
                const id = created.patient_id;
                close();
                router.push(patientRoute({ patientId: id }));
              }}
            />
          </View>
        ) : (
          <View style={styles.form}>
            <Text color="mutedForeground">Synthetic data only. The patient is assigned to you.</Text>
            {mutation.isError && (
              <View style={styles.form} accessibilityRole="alert">
                <Text variant="label" color="destructive">
                  {mutation.error instanceof ApiError ? mutation.error.message : describeError(mutation.error)}
                </Text>
                {duplicate && (
                  <Chips
                    options={[{ value: 'confirm', label: 'This is a different person; register anyway' }]}
                    value={confirmDuplicate ? 'confirm' : undefined}
                    onChange={(value) => setConfirmDuplicate(value === 'confirm')}
                  />
                )}
              </View>
            )}
            <Input label="Full name" value={form.full_name} onChangeText={set('full_name')} maxLength={120} />
            <Input
              label="Date of birth (YYYY-MM-DD)"
              value={form.birth_date}
              onChangeText={set('birth_date')}
              placeholder="1980-04-23"
              keyboardType="numbers-and-punctuation"
              autoCapitalize="none"
              maxLength={10}
              error={form.birth_date && !dobOk ? 'Use a past date as YYYY-MM-DD.' : undefined}
            />
            <Chips
              label="Sex"
              fill
              options={[
                { value: 'F', label: 'Female' },
                { value: 'M', label: 'Male' },
              ]}
              value={sex}
              onChange={(value) => value && setSex(value)}
            />
            <Input label="City (optional)" value={form.city} onChangeText={set('city')} maxLength={120} />
            <Input label="State (optional)" value={form.state} onChangeText={set('state')} maxLength={120} />
            <Input label="Phone (optional)" value={form.phone} onChangeText={set('phone')} keyboardType="phone-pad" />
            <Button
              title="Register patient"
              icon="person-add-outline"
              loading={mutation.isPending}
              disabled={!form.full_name.trim() || !dobOk}
              onPress={submit}
            />
          </View>
        )}
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({ body: { paddingBottom: 8 }, form: { gap: 12 } });
