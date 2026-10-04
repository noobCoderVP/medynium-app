import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { Radius } from '@/constants/theme';
import { SNOWFLAKE_FEATURES } from '@/constants/snowflake';
import { useTheme } from '@/hooks/use-theme';

import { SnowflakeLogo } from './snowflake-logo';

/** The sign-in screen's list of Snowflake features: a heading and one small pill per feature. */
export function BuiltOnSnowflake() {
  const theme = useTheme();
  return (
    <View style={styles.wrap}>
      <View style={styles.heading} accessible accessibilityRole="header" accessibilityLabel="Built on Snowflake">
        <SnowflakeLogo size={18} />
        <Text variant="label" bold>
          Built on Snowflake
        </Text>
      </View>
      <View style={styles.pills}>
        {SNOWFLAKE_FEATURES.map((feature) => (
          <View
            key={feature.name}
            accessible
            accessibilityLabel={`${feature.name}: ${feature.tagline}`}
            style={[styles.pill, { backgroundColor: theme.muted, borderColor: theme.border }]}
          >
            <Text variant="caption" bold>
              {feature.name}
            </Text>
            <Text variant="caption" color="mutedForeground">
              {feature.tagline}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { borderWidth: StyleSheet.hairlineWidth, borderRadius: Radius.md, paddingHorizontal: 10, paddingVertical: 6 },
});
