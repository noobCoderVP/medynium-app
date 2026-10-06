import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';

import { endpoints } from '@/lib/api/endpoints';
import { patientKeys, pendingKeys } from '@/lib/api/keys';
import type { MedicationIn } from '@/lib/api/types';
import { newIdempotencyKey } from '@/lib/idempotency-key';

/**
 * Adds a medicine to the record (doctors). One idempotency key per sheet session, so a retry never adds it twice.
 * The list refreshes on success; summaries catch up on the server within seconds.
 */
export function useAddMedication(patientId: string) {
  const client = useQueryClient();
  const key = useRef(newIdempotencyKey());
  const mutation = useMutation({
    mutationFn: (body: MedicationIn) => endpoints.addMedication(patientId, body, key.current),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: patientKeys.detail(patientId) });
      void client.invalidateQueries({ queryKey: ['patients', patientId, 'medications'] });
      void client.invalidateQueries({ queryKey: pendingKeys.all });
    },
  });
  return {
    mutation,
    reset: () => {
      mutation.reset();
      key.current = newIdempotencyKey();
    },
  };
}
