import { useQuery } from '@tanstack/react-query';

import { endpoints } from '@/lib/api/endpoints';
import { knowledgeKeys } from '@/lib/api/keys';

export const useKnowledgeStatus = () =>
  useQuery({ queryKey: knowledgeKeys.status, queryFn: endpoints.knowledgeStatus });

/** Plain retrieval over the indexed labels, no model call. Runs only for a submitted query of 2+ characters. */
export function useKnowledgeSearch(q: string, drug: string | undefined) {
  return useQuery({
    queryKey: knowledgeKeys.search(q, drug ?? '', ''),
    queryFn: () => endpoints.knowledgeSearch({ q, drug, limit: 10 }),
    enabled: q.length >= 2,
  });
}
