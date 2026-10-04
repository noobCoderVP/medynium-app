import { View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

/** A snowflake glyph in Snowflake's brand blue. Decorative: the words beside it carry the meaning. */
export function SnowflakeLogo({ size = 14 }: { size?: number }) {
  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#29B5E8"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {[0, 60, 120].map((angle) => (
          <G key={angle} rotation={angle} origin="12, 12">
            <Path d="M12 2v20M9.5 4.5 12 7l2.5-2.5M9.5 19.5 12 17l2.5 2.5" />
          </G>
        ))}
      </Svg>
    </View>
  );
}
