import { useInfiniteQuery } from '@tanstack/react-query';

import { endpoints } from '@/lib/api/endpoints';
import { auditKeys } from '@/lib/api/keys';

const PAGE = 25;

/** The signed-in user's audit rows, newest first. Every question, action and denial is in here. */
export const useAudit = () =>
  useInfiniteQuery({
    queryKey: auditKeys.list({}),
    initialPageParam: 0,
    queryFn: ({ pageParam }) => endpoints.audit({ sort: 'when', order: 'desc', limit: PAGE, offset: pageParam }),
    getNextPageParam: (last) => (last.offset + last.limit < last.total ? last.offset + last.limit : undefined),
  });
