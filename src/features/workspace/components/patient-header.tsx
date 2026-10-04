import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Text } from '@/components/ui/text';
import type { Overview } from '@/lib/api/types';
import { formatDate } from '@/lib/format';

import { AllergyLine } from './allergy-line';

function IconButton({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={styles.icon}
      to={0.88}
    >
      <Icon name={icon} size={22} />
    </PressableScale>
  );
}

export function PatientHeader({
  patient,
  onViews,
  onShare,
}: {
  patient: Overview;
  onViews: () => void;
  onShare: () => void;
}) {
  const router = useRouter();
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <IconButton
          icon="chevron-back"
          label="Back"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        />
        <View style={styles.text}>
          <Text variant="heading" numberOfLines={1} accessibilityRole="header">
            {patient.name}
          </Text>
          <Text variant="caption" color="mutedForeground" numberOfLines={1}>
            {patient.age} · {patient.sex}
            {patient.city ? ` · ${patient.city}` : ''} · as of {formatDate(patient.as_of)}
          </Text>
        </View>
        <IconButton icon="bookmark-outline" label="Saved views" onPress={onViews} />
        <IconButton icon="mail-outline" label="Email a summary" onPress={onShare} />
      </View>
      <AllergyLine allergies={patient.allergies} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  icon: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, paddingHorizontal: 4 },
});
