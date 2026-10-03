import { useInfiniteQuery } from '@tanstack/react-query';

import { endpoints } from '@/lib/api/endpoints';
import { patientKeys } from '@/lib/api/keys';

const PAGE = 20;

export interface PatientFilters {
  q: string;
  changed: boolean;
}

/** Pages of the entitled patient list. The server decides who is visible; the app never filters. */
export function usePatients(filters: PatientFilters) {
  return useInfiniteQuery({
    queryKey: patientKeys.list(filters),
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      endpoints.patients({ q: filters.q, changed: filters.changed || undefined, limit: PAGE, offset: pageParam }),
    getNextPageParam: (last) => (last.offset + last.items.length < last.total ? last.offset + last.limit : undefined),
  });
}
