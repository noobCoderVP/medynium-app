import { ScrollView, StyleSheet, View } from 'react-native';

import { PressableScale } from '@/components/ui/pressable-scale';

import { Text } from '@/components/ui/text';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface ChipOption<T extends string | number> {
  value: T;
  label: string;
}

/** Single-select chip row. Pass `allowClear` to let a tap on the selected chip deselect it. */
export function Chips<T extends string | number>({
  label,
  options,
  value,
  onChange,
  scroll = false,
  fill = false,
}: {
  label?: string;
  options: ChipOption<T>[];
  value: T | undefined | null;
  onChange: (value: T | undefined) => void;
  scroll?: boolean;
  /** Segmented look: chips share the row width equally. Use for short sets (≤4 options). */
  fill?: boolean;
}) {
  const theme = useTheme();
  const chips = options.map((o) => {
    const selected = o.value === value;
    return (
      <PressableScale
        key={String(o.value)}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        accessibilityLabel={o.label}
        onPress={() => onChange(selected ? undefined : o.value)}
        style={[
          styles.chip,
          fill && styles.fill,
          {
            backgroundColor: selected ? theme.primary : theme.muted,
            borderColor: selected ? theme.primary : theme.border,
          },
        ]}
      >
        <Text variant="label" color={selected ? 'primaryForeground' : 'foreground'}>
          {o.label}
        </Text>
      </PressableScale>
    );
  });

  return (
    <View style={styles.wrap}>
      {label && (
        <Text variant="label" color="mutedForeground">
          {label}
        </Text>
      )}
      {scroll ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {chips}
        </ScrollView>
      ) : (
        <View style={[styles.row, !fill && styles.wrapRow]}>{chips}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  row: { flexDirection: 'row', gap: 8 },
  wrapRow: { flexWrap: 'wrap' },
  fill: { flex: 1, alignItems: 'center', paddingHorizontal: 4 },
  chip: { borderWidth: 1, borderRadius: Radius.full, paddingHorizontal: 12, minHeight: 40, justifyContent: 'center' },
});
