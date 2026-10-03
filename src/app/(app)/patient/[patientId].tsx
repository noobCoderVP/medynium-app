import { useLocalSearchParams } from 'expo-router';

import { isTabKey, PatientWorkspace } from '@/features/workspace';

export default function PatientScreen() {
  const params = useLocalSearchParams<{ patientId: string; tab?: string; lab?: string; from?: string; to?: string }>();
  return (
    <PatientWorkspace
      // A different patient or a new action target gets a fresh workspace, so no state leaks between patients.
      key={`${params.patientId}|${params.tab}|${params.lab}|${params.from}|${params.to}`}
      patientId={params.patientId}
      initialTab={isTabKey(params.tab) ? params.tab : undefined}
      lab={params.lab}
      from={params.from}
      to={params.to}
    />
  );
}
