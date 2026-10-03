import { StyleSheet, View } from 'react-native';

import { DataState } from '@/components/shared/data-state';
import { PatientRow } from '@/components/shared/patient-row';
import { Section } from '@/components/shared/section';
import { Reveal } from '@/components/ui/reveal';
import { ScreenHeader } from '@/components/ui/screen-header';
import { TabScreen } from '@/components/ui/tab-screen';
import { Text } from '@/components/ui/text';
import { SyntheticBanner } from '@/components/synthetic-banner';
import { copy } from '@/lib/copy';
import { formatDate } from '@/lib/format';

import { useDashboard } from '../hooks/use-dashboard';
import { BriefingCard } from './briefing-card';
import { RecentChangesView } from './recent-changes';
import { UtilizationTiles } from './utilization-tiles';

/** "Show me my patients and who changed." One call to GET /dashboard; the briefing runs on request. */
export function DashboardView() {
  const query = useDashboard();
  return (
    <TabScreen refreshing={query.isRefetching} onRefresh={() => void query.refetch()}>
      <ScreenHeader title="Home" subtitle={query.data ? `As of ${formatDate(query.data.as_of)}` : undefined} />
      <SyntheticBanner />
      <DataState query={query}>
        {(data) => (
          <View style={styles.stack}>
            <Reveal index={0}>
              <BriefingCard />
            </Reveal>
            <Reveal index={1}>
              <UtilizationTiles utilization={data.utilization} />
            </Reveal>
            <Reveal index={2}>
              <RecentChangesView changes={data.recent_changes} />
            </Reveal>
            <Section title="Your patients" aside={`${data.worklist.length}`}>
              {data.worklist.length === 0 ? (
                <Text color="mutedForeground">{copy.empty.worklist}</Text>
              ) : (
                data.worklist.map((item, index) => (
                  <PatientRow
                    index={index}
                    key={item.patient_id}
                    patientId={item.patient_id}
                    name={item.name}
                    age={item.age}
                    sex={item.sex}
                    lastEncounter={item.last_encounter}
                    flags={item.flags}
                  />
                ))
              )}
            </Section>
          </View>
        )}
      </DataState>
    </TabScreen>
  );
}

const styles = StyleSheet.create({ stack: { gap: 20 } });
