import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { endpoints } from '@/lib/api/endpoints';
import { patientKeys } from '@/lib/api/keys';

/**
 * The stored written summary of a patient. It is written once (the first time anyone opens the patient) and kept;
 * after that only Refresh writes it again. The write takes about fifteen seconds, so the card shows progress.
 */
export function usePatientSummary(patientId: string) {
  const client = useQueryClient();
  const key = patientKeys.summary(patientId);
  const query = useQuery({ queryKey: key, queryFn: () => endpoints.patientSummary(patientId), staleTime: 60_000 });
  const refresh = useMutation({
    mutationFn: () => endpoints.refreshPatientSummary(patientId),
    onSuccess: (data) => client.setQueryData(key, data),
  });
  const started = useRef(false);
  const missing = query.data ? !query.data.exists : false;
  useEffect(() => {
    if (missing && !started.current) {
      started.current = true; // once per screen: a failed first write is retried by the button, not in a loop
      refresh.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missing]);
  return { query, refresh };
}
