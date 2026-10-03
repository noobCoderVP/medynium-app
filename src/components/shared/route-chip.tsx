import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { copy } from '@/lib/copy';

/** Which path answered: the route, and the model or "no model call" (cost transparency, AI-04). */
export function RouteChip({
  route,
  model,
  costNote,
}: {
  route: string;
  model?: string | null;
  costNote?: string | null;
}) {
  const theme = useTheme();
  const text = `${route} · ${model ?? copy.agent.noModel}${costNote && model ? ` · ${costNote}` : ''}`;
  return (
    <View
      style={[styles.chip, { backgroundColor: theme.muted, borderColor: theme.border }]}
      accessible
      accessibilityLabel={`Route ${text}`}
    >
      <Text variant="caption" color="mutedForeground">
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
});
