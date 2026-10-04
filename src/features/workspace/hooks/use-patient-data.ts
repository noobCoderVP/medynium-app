import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { endpoints } from '@/lib/api/endpoints';
import { ApiError } from '@/lib/api/errors';
import { patientKeys, pendingKeys } from '@/lib/api/keys';

const PAGE = 25;

interface Paged {
  total: number;
  limit: number;
  offset: number;
}

/** Pages of one patient list. Tabs show a "Load more" button, so the page scrolls as one document. */
function usePaged<P extends Paged>(key: readonly unknown[], fetchPage: (offset: number) => Promise<P>, enabled = true) {
  return useInfiniteQuery({
    queryKey: key,
    enabled,
    initialPageParam: 0,
    queryFn: ({ pageParam }) => fetchPage(pageParam),
    getNextPageParam: (last) => (last.offset + last.limit < last.total ? last.offset + last.limit : undefined),
  });
}

/** The gate. A denied patient and a missing one both fail here with the same 404. */
export const usePatient = (id: string) =>
  useQuery({ queryKey: patientKeys.detail(id), queryFn: () => endpoints.patient(id) });

export function useTimeline(id: string, filters: { types?: string; from?: string; to?: string }) {
  return usePaged(patientKeys.timeline(id, filters), (offset) =>
    endpoints.timeline(id, { ...filters, order: 'desc', limit: PAGE, offset }),
  );
}

export function useMedications(id: string, status: 'active' | 'all') {
  return usePaged(patientKeys.medications(id, { status }), (offset) =>
    endpoints.medications(id, { status, limit: PAGE, offset }),
  );
}

export function useLabs(id: string, flag?: string) {
  return usePaged(patientKeys.labs(id, { flag }), (offset) => endpoints.labs(id, { flag, limit: PAGE, offset }));
}

export const useLabTrend = (id: string, code: string | null) =>
  useQuery({
    queryKey: patientKeys.trend(id, code ?? ''),
    queryFn: () => endpoints.labTrend(id, code as string),
    enabled: !!code,
  });

export function useClaims(id: string) {
  return usePaged(patientKeys.claims(id, {}), (offset) => endpoints.claims(id, { limit: PAGE, offset }));
}

export function useNotes(id: string) {
  return usePaged(patientKeys.notes(id, {}), (offset) => endpoints.notes(id, { limit: PAGE, offset }));
}

export const useNote = (id: string, noteId: string | null) =>
  useQuery({
    queryKey: patientKeys.note(id, noteId ?? ''),
    queryFn: () => endpoints.note(id, noteId as string),
    enabled: !!noteId,
  });

/** Patients like this one among the clinician's own patients. Computed on the server and never padded. */
export const useSimilar = (id: string) =>
  useQuery({
    queryKey: patientKeys.similar(id),
    queryFn: () => endpoints.similar(id, { limit: 5 }),
    staleTime: 60_000,
  });

const WORKING = new Set(['UPLOADED', 'PARSING']);

export const reportErrorText = (error: unknown) =>
  error instanceof ApiError ? error.message : 'That did not work. Try again.';

/** The patient's reports. While one is being read the list refreshes itself every few seconds. */
export const useReports = (id: string) =>
  useQuery({
    queryKey: patientKeys.reports(id),
    queryFn: () => endpoints.reports(id),
    refetchInterval: (query) => (query.state.data?.items.some((r) => WORKING.has(r.status)) ? 3000 : false),
  });

export const useReport = (id: string, reportId: string | null) =>
  useQuery({
    queryKey: patientKeys.report(id, reportId ?? ''),
    queryFn: () => endpoints.report(id, reportId as string),
    enabled: !!reportId,
  });

/** Upload, row decisions, approve and reject. Nothing reaches the record until a doctor approves. */
export function useReportActions(patientId: string) {
  const queryClient = useQueryClient();
  const refresh = (reportId?: string) => {
    void queryClient.invalidateQueries({ queryKey: patientKeys.reports(patientId) });
    if (reportId) void queryClient.invalidateQueries({ queryKey: patientKeys.report(patientId, reportId) });
  };
  const upload = useMutation({
    mutationFn: (file: { blob: Blob; name: string; type: string }) => endpoints.uploadReport(patientId, file),
    onSuccess: () => refresh(),
  });
  const decide = useMutation({
    mutationFn: (v: { reportId: string; rowId: string; decision: 'accept' | 'reject'; version: number }) =>
      endpoints.decideRow(patientId, v.rowId, v.decision, v.version),
    onSuccess: (_data, v) => refresh(v.reportId),
  });
  const approve = useMutation({
    mutationFn: (v: { reportId: string; confirmIdentity: boolean }) =>
      endpoints.approveReport(patientId, v.reportId, v.confirmIdentity),
    onSuccess: (_data, v) => {
      refresh(v.reportId);
      // Approved rows change the record and what is pending.
      void queryClient.invalidateQueries({ queryKey: patientKeys.all });
      void queryClient.invalidateQueries({ queryKey: pendingKeys.all });
    },
  });
  const reject = useMutation({
    mutationFn: (reportId: string) => endpoints.rejectReport(patientId, reportId),
    onSuccess: (_data, reportId) => refresh(reportId),
  });
  return { upload, decide, approve, reject };
}
