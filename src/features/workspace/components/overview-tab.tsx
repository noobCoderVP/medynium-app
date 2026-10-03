import { StyleSheet, View } from 'react-native';

import { Section } from '@/components/shared/section';
import { Reveal } from '@/components/ui/reveal';
import { RecordRow } from '@/components/shared/record-row';
import { StatGrid, StatTile } from '@/components/shared/stat-tile';
import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import type { Overview } from '@/lib/api/types';
import { formatDate, formatMoney, formatShortDate, formatValue } from '@/lib/format';

/** Everything already loaded by the gate: no second call. */
export function OverviewTab({ data }: { data: Overview }) {
  const abnormal = data.latest_labs.filter((lab) => lab.flag === 'HIGH' || lab.flag === 'LOW');
  return (
    <View style={styles.stack}>
      {abnormal.length > 0 && (
        <Reveal index={0}>
          <Section title="Needs attention" aside="Requires review">
            {abnormal.map((lab) => (
              <RecordRow
                key={lab.lab_id}
                title={lab.test}
                lines={[formatDate(lab.date)]}
                right={
                  <>
                    <Text variant="label">{formatValue(lab.value, lab.unit)}</Text>
                    <Badge label={lab.flag === 'HIGH' ? 'High' : 'Low'} tone="warning" />
                  </>
                }
              />
            ))}
          </Section>
        </Reveal>
      )}
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
            <StatTile label="Outpatient visits" value={`${data.utilization.opd_visits}`} />
            <StatTile label="Emergency visits" value={`${data.utilization.emergency_visits}`} />
            <StatTile label="Admissions" value={`${data.utilization.hospitalizations}`} />
            <StatTile label="Approved" value={formatMoney(data.utilization.approved)} />
          </StatGrid>
        </Section>
      </Reveal>
    </View>
  );
}

const styles = StyleSheet.create({ stack: { gap: 20 } });
