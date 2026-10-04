import { useQuery } from '@tanstack/react-query';

import { endpoints } from '@/lib/api/endpoints';
import { patientKeys } from '@/lib/api/keys';

/** Attention, changes since the previous visit, gaps and latest results: rules only, no model call. */
export function useBrief(patientId: string) {
  return useQuery({
    queryKey: patientKeys.brief(patientId),
    queryFn: () => endpoints.brief(patientId),
    staleTime: 60_000,
  });
}

/** The written summary, asked for after the brief is on screen so the screen never waits for a model. */
export function useBriefSummary(patientId: string, enabled: boolean) {
  return useQuery({
    queryKey: patientKeys.briefSummary(patientId),
    queryFn: () => endpoints.briefSummary(patientId),
    enabled,
    staleTime: 10 * 60_000,
    retry: false,
  });
}

/** Changes over a longer window than the previous visit (the brief already carries that one). */
export function useChanges(patientId: string, from: string, enabled: boolean) {
  return useQuery({
    queryKey: patientKeys.changes(patientId, from),
    queryFn: () => endpoints.changes(patientId, from),
    enabled,
    staleTime: 60_000,
  });
}
