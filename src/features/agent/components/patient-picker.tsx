import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Sheet } from '@/components/ui/sheet';
import { Text } from '@/components/ui/text';
import { usePatients } from '@/features/patients';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { clearScope, setOpenPatient, useOpenPatient, useRecentPatients, type OpenPatient } from '@/lib/open-patient';

function Option({
  title,
  detail,
  selected,
  onPress,
}: {
  title: string;
  detail?: string;
  selected: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${title}${detail ? `, ${detail}` : ''}${selected ? ', selected' : ''}`}
      onPress={onPress}
      to={0.98}
      style={[
        styles.option,
        { backgroundColor: selected ? theme.accent : theme.card, borderColor: selected ? theme.primary : theme.border },
      ]}
    >
      <Avatar name={title} />
      <View style={styles.optionText}>
        <Text variant="label" bold numberOfLines={1}>
          {title}
        </Text>
        {detail ? (
          <Text variant="caption" color="mutedForeground" numberOfLines={1}>
            {detail}
          </Text>
        ) : null}
      </View>
    </PressableScale>
  );
}

/** Pick who the assistant answers about: all patients, a recent one, or a search of the clinician's own list. */
export function PatientPicker({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const current = useOpenPatient();
  const recent = useRecentPatients();
  const [text, setText] = useState('');
  const [q, setQ] = useState('');

  useEffect(() => {
    const id = setTimeout(() => setQ(text.trim()), 300);
    return () => clearTimeout(id);
  }, [text]);

  const query = usePatients({ q, changed: false });
  const results = query.data?.pages.flatMap((page) => page.items) ?? [];
  const searching = q.length > 0;

  const choose = (patient: OpenPatient) => {
    setOpenPatient(patient);
    setText('');
    onClose();
  };

  return (
    <Sheet visible={visible} onClose={onClose} title="Who are you asking about?">
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <Input
          label="Search patients"
          value={text}
          onChangeText={setText}
          placeholder="Name or condition"
          autoCapitalize="none"
          returnKeyType="search"
        />
        {!searching ? (
          <>
            <Option
              title="All my patients"
              detail="Ask about your whole list: who needs attention, what is pending"
              selected={current === null}
              onPress={() => {
                clearScope();
                onClose();
              }}
            />
            {recent.length > 0 ? (
              <Text variant="label" color="mutedForeground">
                Recent
              </Text>
            ) : null}
            {recent.map((p) => (
              <Option
                key={p.id}
                title={p.name}
                detail={p.id}
                selected={current?.id === p.id}
                onPress={() => choose(p)}
              />
            ))}
          </>
        ) : null}
        <Text variant="label" color="mutedForeground">
          {searching ? 'Results' : 'Your patients'}
        </Text>
        {query.isPending ? <Text color="mutedForeground">Loading…</Text> : null}
        {query.isError ? (
          <Text color="destructive" accessibilityRole="alert">
            Could not load patients. Try again.
          </Text>
        ) : null}
        {!query.isPending && !query.isError && results.length === 0 ? (
          <Text color="mutedForeground">No patients match.</Text>
        ) : null}
        {results.map((p) => (
          <Option
            key={p.patient_id}
            title={p.name}
            detail={`${p.age} · ${p.sex}`}
            selected={current?.id === p.patient_id}
            onPress={() => choose({ id: p.patient_id, name: p.name })}
          />
        ))}
        {query.hasNextPage ? (
          <Text color="primary" onPress={() => void query.fetchNextPage()} accessibilityRole="button">
            Show more
          </Text>
        ) : null}
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: { gap: 8, paddingBottom: 8 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: 10,
    minHeight: 56,
  },
  optionText: { flex: 1 },
});
