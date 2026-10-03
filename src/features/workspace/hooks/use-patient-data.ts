import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { endpoints } from '@/lib/api/endpoints';
import { patientKeys } from '@/lib/api/keys';

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
