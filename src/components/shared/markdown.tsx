import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';

/**
 * A small, safe markdown renderer for the written patient summary: `##` headings, `-` bullets, `**bold**`, `*italic*`
 * and paragraphs (same subset as the web). It builds native text only; anything else is shown as plain text.
 */
function inline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(
      match[1] !== undefined ? (
        <Text key={match.index} bold>
          {match[1]}
        </Text>
      ) : (
        <Text key={match.index} style={styles.italic}>
          {match[2]}
        </Text>
      ),
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function Markdown({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let bullets: string[] = [];
  const flush = () => {
    if (bullets.length === 0) return;
    const items = bullets;
    bullets = [];
    blocks.push(
      <View key={`ul-${blocks.length}`} style={styles.list}>
        {items.map((item, i) => (
          <View key={i} style={styles.bullet}>
            <Text accessibilityElementsHidden importantForAccessibility="no">
              •
            </Text>
            <Text style={styles.bulletText}>{inline(item)}</Text>
          </View>
        ))}
      </View>,
    );
  };
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    const heading = /^#{1,4}\s+(.*)$/.exec(line);
    const bullet = /^[-*]\s+(.*)$/.exec(line);
    if (bullet) {
      bullets.push(bullet[1]);
      continue;
    }
    flush();
    if (heading) {
      blocks.push(
        <Text key={`h-${blocks.length}`} variant="label" color="mutedForeground" accessibilityRole="header">
          {heading[1].toUpperCase()}
        </Text>,
      );
    } else if (line) {
      blocks.push(<Text key={`p-${blocks.length}`}>{inline(line)}</Text>);
    }
  }
  flush();
  return <View style={styles.stack}>{blocks}</View>;
}

const styles = StyleSheet.create({
  stack: { gap: 8 },
  list: { gap: 4 },
  bullet: { flexDirection: 'row', gap: 8 },
  bulletText: { flex: 1 },
  italic: { fontStyle: 'italic' },
});
