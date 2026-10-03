import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Polyline, Rect } from 'react-native-svg';

import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/use-theme';
import type { LabTrend } from '@/lib/api/types';
import { formatDate, formatValue } from '@/lib/format';

const HEIGHT = 180;
const PAD = { top: 12, bottom: 12, left: 8, right: 8 };

/**
 * A trend line with the reference range as a shaded band. The values are also listed as text under the chart,
 * so nothing depends on seeing the picture (rule 9).
 */
export function LabChart({ trend }: { trend: LabTrend }) {
  const theme = useTheme();
  const [width, setWidth] = useState(0);
  const points = [...trend.points].sort((a, b) => a.date.localeCompare(b.date));
  const { low, high } = trend.ref;

  const values = [...points.map((p) => p.value), ...(low === null ? [] : [low]), ...(high === null ? [] : [high])];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const innerW = Math.max(width - PAD.left - PAD.right, 1);
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const times = points.map((p) => new Date(p.date).getTime());
  const t0 = Math.min(...times);
  const tSpan = Math.max(...times) - t0 || 1;
  const x = (i: number) => PAD.left + (points.length === 1 ? innerW / 2 : ((times[i] - t0) / tSpan) * innerW);
  const y = (v: number) => PAD.top + innerH - ((v - min) / span) * innerH;

  const summary = `${trend.test} trend, ${points.length} values from ${formatDate(points[0]?.date)} to ${formatDate(points.at(-1)?.date)}. Latest ${formatValue(points.at(-1)?.value, trend.unit)}.`;

  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} accessible accessibilityLabel={summary}>
      {width > 0 && (
        <Svg width={width} height={HEIGHT}>
          {low !== null && high !== null && (
            <Rect
              x={PAD.left}
              y={y(high)}
              width={innerW}
              height={Math.max(y(low) - y(high), 1)}
              fill={theme.success}
              opacity={0.15}
            />
          )}
          {[low, high].map((bound, i) =>
            bound === null ? null : (
              <Line
                key={i}
                x1={PAD.left}
                x2={PAD.left + innerW}
                y1={y(bound)}
                y2={y(bound)}
                stroke={theme.mutedForeground}
                strokeDasharray="4 4"
                strokeWidth={1}
              />
            ),
          )}
          <Polyline
            points={points.map((p, i) => `${x(i)},${y(p.value)}`).join(' ')}
            fill="none"
            stroke={theme.foreground}
            strokeWidth={2}
          />
          {points.map((p, i) => (
            <Circle key={p.lab_id} cx={x(i)} cy={y(p.value)} r={4} fill={theme.foreground} />
          ))}
        </Svg>
      )}
      <Text variant="caption" color="mutedForeground">
        {low !== null || high !== null
          ? `Reference range ${low ?? '–'} to ${high ?? '–'}${trend.unit ? ` ${trend.unit}` : ''} (shaded band).`
          : 'No reference range on record.'}
      </Text>
    </View>
  );
}

export const labChartStyles = StyleSheet.create({});
