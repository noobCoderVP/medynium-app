import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';

import { SnowflakeLogo } from './snowflake-logo';

/** A one-line credit that takes almost no room: under the assistant's composer and on sign-in. */
export function PoweredBySnowflake() {
  return (
    <View style={styles.row} accessible accessibilityLabel="Powered by Snowflake">
      <SnowflakeLogo size={12} />
      <Text variant="caption" color="mutedForeground">
        Powered by Snowflake
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
});
