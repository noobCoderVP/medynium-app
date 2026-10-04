import { StyleSheet, View } from 'react-native';

import { Section } from '@/components/shared/section';
import { Reveal } from '@/components/ui/reveal';
import { RecordRow } from '@/components/shared/record-row';
import { StatGrid, StatTile } from '@/components/shared/stat-tile';
import { Text } from '@/components/ui/text';
import { ListSkeleton } from '@/components/ui/skeleton';
import type { Overview } from '@/lib/api/types';
import { formatMoney, formatShortDate } from '@/lib/format';
import type { WorkspaceTarget } from '@/lib/source-link';

import { useBrief } from '../hooks/use-brief';
import { AttentionPanel } from './attention-panel';
import { BriefAttention } from './brief-attention';
import { BriefChanges } from './brief-changes';
import { BriefGaps } from './brief-gaps';
import { ClinicalBrief } from './clinical-brief';

/** Everything already loaded by the gate: no second call. */
export function OverviewTab({
  data,
  onReviewSafety,
  onOpenLab,
  onAllFlagged,
  onOpenTarget,
  onOpenSimilar,
}: {
  data: Overview;
  onReviewSafety: () => void;
  onOpenLab: (code: string) => void;
  onAllFlagged: () => void;
  onOpenTarget: (target: WorkspaceTarget) => void;
  onOpenSimilar: () => void;
}) {
  const brief = useBrief(data.patient_id);
  return (
    <View style={styles.stack}>
      {brief.data ? (
        <>
          <Reveal index={0}>
            <ClinicalBrief brief={brief.data} onReviewSafety={onReviewSafety} onOpenSimilar={onOpenSimilar} />
          </Reveal>
          <BriefAttention
            patientId={data.patient_id}
            items={brief.data.attention.items}
            high={brief.data.attention.counts.high ?? 0}
            onOpen={onOpenTarget}
          />
          <BriefChanges patientId={data.patient_id} initial={brief.data.changes} onOpen={onOpenTarget} />
          <BriefGaps patientId={data.patient_id} items={brief.data.gaps} onOpen={onOpenTarget} />
        </>
      ) : (
        <>
          {brief.isError ? (
            <Text color="mutedForeground" accessibilityRole="alert">
              The brief could not be loaded. The record below is unaffected.
            </Text>
          ) : (
            <ListSkeleton rows={3} />
          )}
          <Reveal index={0}>
            <AttentionPanel
              patient={data}
              onReviewSafety={onReviewSafety}
              onOpenLab={onOpenLab}
              onAllFlagged={onAllFlagged}
            />
          </Reveal>
        </>
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
      <Reveal index={3}>
        <Section title="Last 12 months" aside={data.utilization.window}>
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
