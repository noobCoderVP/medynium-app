import { QueryClient } from '@tanstack/react-query';

import { shouldRetry } from '@/lib/api/errors';

/** In memory only: clinical data is never persisted on the device (rule M3). Cleared on sign-out. */
export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, gcTime: 5 * 60_000, retry: shouldRetry, refetchOnReconnect: true } },
});
