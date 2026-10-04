import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Chips } from '@/components/ui/chips';
import { Reveal } from '@/components/ui/reveal';
import { ScreenHeader } from '@/components/ui/screen-header';
import { TabScreen } from '@/components/ui/tab-screen';
import { Text } from '@/components/ui/text';

import { DOC_SECTIONS } from '../lib/sections';

/** The user guide: pick a section, read its topics. Static text; no API call. */
export function DocsView() {
  const [id, setId] = useState(DOC_SECTIONS[0].id);
  const section = DOC_SECTIONS.find((s) => s.id === id) ?? DOC_SECTIONS[0];
  return (
    <TabScreen back>
      <ScreenHeader title="Documentation" subtitle="How to use Medynium, written for the people who use it." />
      <Chips
        scroll
        label="Section"
        options={DOC_SECTIONS.map((s) => ({ value: s.id, label: s.title }))}
        value={id}
        onChange={(value) => value && setId(value)}
      />
      <Reveal key={section.id} index={0}>
        <View style={styles.section}>
          <Text variant="heading" accessibilityRole="header">
            {section.title}
          </Text>
          <Text color="mutedForeground">{section.summary}</Text>
          {section.topics.map((topic) => (
            <Card key={topic.title} style={styles.topic}>
              <Text variant="label" bold accessibilityRole="header">
                {topic.title}
              </Text>
              <Text color="mutedForeground">{topic.body}</Text>
            </Card>
          ))}
        </View>
      </Reveal>
    </TabScreen>
  );
}

const styles = StyleSheet.create({ section: { gap: 10 }, topic: { gap: 4 } });
