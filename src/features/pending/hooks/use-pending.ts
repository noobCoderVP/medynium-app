import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { endpoints } from '@/lib/api/endpoints';
import { pendingKeys } from '@/lib/api/keys';

const PAGE = 25;

/** Pending items across the signed-in clinician's own patients, most urgent first. The server scopes them. */
export function usePending(kind: string) {
  const list = useInfiniteQuery({
    queryKey: pendingKeys.list({ kind }),
    initialPageParam: 0,
    queryFn: ({ pageParam }) => endpoints.pending({ kind, limit: PAGE, offset: pageParam }),
    getNextPageParam: (last) => (last.offset + last.limit < last.total ? last.offset + last.limit : undefined),
  });
  const summary = useQuery({ queryKey: pendingKeys.summary, queryFn: () => endpoints.pendingSummary() });
  return { list, summary };
}
