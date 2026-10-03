import { StyleSheet, View } from 'react-native';

import { Card, PressableCard } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

/** A record in a list: a title, optional detail lines, and something on the right (a value or a badge). */
export function RecordRow({
  title,
  lines = [],
  right,
  onPress,
  label,
}: {
  title: string;
  lines?: (string | null | undefined)[];
  right?: React.ReactNode;
  onPress?: () => void;
  label?: string;
}) {
  const body = (
    <View style={styles.row}>
      <View style={styles.main}>
        <Text variant="label">{title}</Text>
        {lines
          .filter((line): line is string => !!line)
          .map((line) => (
            <Text key={line} variant="caption" color="mutedForeground">
              {line}
            </Text>
          ))}
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
  const spoken = label ?? [title, ...lines].filter(Boolean).join('. ');
  if (!onPress) {
    return (
      <Card accessible accessibilityLabel={spoken}>
        {body}
      </Card>
    );
  }
  return (
    <PressableCard label={spoken} onPress={onPress}>
      {body}
    </PressableCard>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  main: { flex: 1, gap: 2 },
  right: { alignItems: 'flex-end', gap: 4 },
});
