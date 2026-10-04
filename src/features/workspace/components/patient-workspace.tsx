import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DataState } from '@/components/shared/data-state';
import { Button } from '@/components/ui/button';
import { Chips } from '@/components/ui/chips';
import { EmptyState } from '@/components/ui/empty-state';
import { ListSkeleton } from '@/components/ui/skeleton';
import { SyntheticBanner } from '@/components/synthetic-banner';
import { MaxContentWidth } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Overview } from '@/lib/api/types';
import { copy } from '@/lib/copy';
import { fadeIn } from '@/lib/motion';
import { clearOpenPatient, setOpenPatient } from '@/lib/open-patient';

import { usePatient } from '../hooks/use-patient-data';
import { ClaimsTab } from './claims-tab';
import { LabsTab } from './labs-tab';
import { MedicationsTab } from './medications-tab';
import { NotesTab } from './notes-tab';
import { OverviewTab } from './overview-tab';
import { PatientHeader } from './patient-header';
import { ReportsTab } from './reports-tab';
import { SafetyTab } from './safety-tab';
import { SimilarTab } from './similar-tab';
import { ShareSheet } from './share-sheet';
import { TimelineTab } from './timeline-tab';
import { ViewsSheet } from './views-sheet';

export type TabKey =
  'overview' | 'timeline' | 'medications' | 'labs' | 'safety' | 'claims' | 'notes' | 'reports' | 'similar';

const TABS: { value: TabKey; label: string }[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'timeline', label: 'Timeline' },
  { value: 'medications', label: 'Medicines' },
  { value: 'labs', label: 'Labs' },
  { value: 'safety', label: 'Safety' },
  { value: 'claims', label: 'Claims' },
  { value: 'notes', label: 'Notes' },
  { value: 'reports', label: 'Reports' },
  { value: 'similar', label: 'Similar' },
];

export const isTabKey = (value: string | undefined): value is TabKey => TABS.some((t) => t.value === value);

interface Props {
  patientId: string;
  initialTab?: TabKey;
  lab?: string;
  from?: string;
  to?: string;
}

/**
 * The gate: loads the patient first. A denied patient and a missing one both fail with the same 404 and the same
 * "couldn't find that patient" state, with no header, no tabs and no content, so nothing hints the patient exists.
 * Tab content renders only after the patient has loaded. The header and section tabs stay pinned while the page scrolls.
 */
export function PatientWorkspace(props: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const query = usePatient(props.patientId);

  // Tell the Ask tab which patient is open (context only; the server re-checks access).
  const name = query.data?.name;
  useEffect(() => {
    if (name) setOpenPatient({ id: props.patientId, name });
    return () => clearOpenPatient(props.patientId);
  }, [props.patientId, name]);

  return (
    <View style={[styles.fill, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <DataState
        query={query}
        skeleton={
          <View style={styles.pad}>
            <ListSkeleton rows={3} />
          </View>
        }
        notFound={
          <EmptyState
            icon="search-outline"
            title={copy.notFound.patient.title}
            description={copy.notFound.patient.body}
            actionLabel="Back to patients"
            onAction={() => router.replace('/patients')}
          />
        }
      >
        {(patient) => (
          <Loaded patient={patient} refetch={() => void query.refetch()} refreshing={query.isRefetching} {...props} />
        )}
      </DataState>
      {query.isError && <Button title="Back" variant="ghost" onPress={() => router.back()} />}
    </View>
  );
}

function Loaded({
  patient,
  refetch,
  refreshing,
  patientId,
  initialTab,
  lab,
  from,
  to,
}: Props & { patient: Overview; refetch: () => void; refreshing: boolean }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<TabKey>(initialTab ?? 'overview');
  const [range, setRange] = useState<{ from?: string; to?: string; lab?: string }>({ from, to, lab });
  const [labFlag, setLabFlag] = useState<string | undefined>();
  const [sheet, setSheet] = useState<'views' | 'share' | null>(null);

  return (
    <>
      <View style={[styles.pinned, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <PatientHeader patient={patient} onViews={() => setSheet('views')} onShare={() => setSheet('share')} />
        <Chips scroll options={TABS} value={tab} onChange={(value) => value && setTab(value)} />
      </View>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refetch} tintColor={theme.mutedForeground} />
        }
      >
        <SyntheticBanner />
        <Animated.View key={tab} entering={fadeIn} style={styles.tab}>
          {tab === 'overview' && (
            <OverviewTab
              data={patient}
              onReviewSafety={() => setTab('safety')}
              onOpenLab={(code) => {
                setRange({ lab: code });
                setTab('labs');
              }}
              onAllFlagged={() => {
                setLabFlag('abnormal');
                setTab('labs');
              }}
            />
          )}
          {tab === 'timeline' && (
            <TimelineTab patientId={patientId} from={range.from} to={range.to} onClearRange={() => setRange({})} />
          )}
          {tab === 'medications' && <MedicationsTab patientId={patientId} />}
          {tab === 'labs' && <LabsTab patientId={patientId} lab={range.lab} initialFlag={labFlag} />}
          {tab === 'claims' && <ClaimsTab patientId={patientId} />}
          {tab === 'notes' && <NotesTab patientId={patientId} />}
          {tab === 'safety' && <SafetyTab patientId={patientId} />}
          {tab === 'reports' && <ReportsTab patientId={patientId} />}
          {tab === 'similar' && <SimilarTab patientId={patientId} />}
        </Animated.View>
      </ScrollView>
      <ViewsSheet
        patientId={patientId}
        visible={sheet === 'views'}
        onClose={() => setSheet(null)}
        current={{ tab, params: range }}
        onOpen={(view) => {
          setTab(view.tab);
          setRange(view.params);
        }}
      />
      <ShareSheet
        patientId={patientId}
        patientName={patient.name}
        visible={sheet === 'share'}
        onClose={() => setSheet(null)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  pad: { padding: 16 },
  pinned: {
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 10,
    gap: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  content: { padding: 16, gap: 16, width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center' },
  tab: { gap: 16 },
});
