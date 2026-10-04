import { StyleSheet, View } from 'react-native';

import { Section } from '@/components/shared/section';
import { Reveal } from '@/components/ui/reveal';
import { RecordRow } from '@/components/shared/record-row';
import { StatGrid, StatTile } from '@/components/shared/stat-tile';
import { Text } from '@/components/ui/text';
import type { Overview } from '@/lib/api/types';
import { formatMoney, formatShortDate } from '@/lib/format';

import { AttentionPanel } from './attention-panel';

/** Everything already loaded by the gate: no second call. */
export function OverviewTab({
  data,
  onReviewSafety,
  onOpenLab,
  onAllFlagged,
}: {
  data: Overview;
  onReviewSafety: () => void;
  onOpenLab: (code: string) => void;
  onAllFlagged: () => void;
}) {
  return (
    <View style={styles.stack}>
      <Reveal index={0}>
        <AttentionPanel
          patient={data}
          onReviewSafety={onReviewSafety}
          onOpenLab={onOpenLab}
          onAllFlagged={onAllFlagged}
        />
      </Reveal>
      <Reveal index={1}>
        <Section title="Diagnoses" aside={`${data.diagnoses.length}`}>
          {data.diagnoses.length === 0 ? (
            <Text color="mutedForeground">No diagnoses on record.</Text>
          ) : (
            data.diagnoses.map((dx) => (
              <RecordRow
                key={dx.diagnosis_id}
                title={dx.description}
                lines={[dx.onset_year ? `Since ${dx.onset_year}` : null, dx.code]}
              />
            ))
          )}
        </Section>
      </Reveal>
      <Reveal index={2}>
        <Section title="Current medicines" aside={`${data.medications.length}`}>
          {data.medications.length === 0 ? (
            <Text color="mutedForeground">No medicines on record.</Text>
          ) : (
            data.medications.map((med) => (
              <RecordRow
                key={med.medication_id}
                title={med.drug}
                lines={[[med.dose, med.strength].filter(Boolean).join(' · ') || null]}
              />
            ))
          )}
        </Section>
      </Reveal>
      <Reveal index={3}>
        <Section title="Recent events">
          {data.recent_events.length === 0 ? (
            <Text color="mutedForeground">No recent events.</Text>
          ) : (
            data.recent_events.map((event) => (
              <RecordRow
                key={event.event_id}
                title={event.title}
                lines={[event.summary]}
                right={
                  <Text variant="caption" color="mutedForeground">
                    {formatShortDate(event.date)}
                  </Text>
                }
              />
            ))
          )}
        </Section>
      </Reveal>
      <Reveal index={4}>
        <Section title="Utilisation" aside={data.utilization.window}>
          <StatGrid>
            <StatTile label="Outpatient visits" value={data.utilization.opd_visits} />
            <StatTile label="Emergency visits" value={data.utilization.emergency_visits} />
            <StatTile label="Admissions" value={data.utilization.hospitalizations} />
            <StatTile
              label="Approved"
              value={data.utilization.approved.amount}
              format={(n) => formatMoney({ amount: n })}
            />
          </StatGrid>
        </Section>
      </Reveal>
    </View>
  );
}

const styles = StyleSheet.create({ stack: { gap: 20 } });
