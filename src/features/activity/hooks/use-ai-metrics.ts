import { useQuery } from '@tanstack/react-query';

import { endpoints } from '@/lib/api/endpoints';
import { auditKeys } from '@/lib/api/keys';

/** The assistant's own activity for the signed-in user over the last `days` days. */
export const useAiMetrics = (days = 7) =>
  useQuery({
    queryKey: auditKeys.ai(days),
    queryFn: () => endpoints.aiMetrics(days),
    staleTime: 30_000,
  });
