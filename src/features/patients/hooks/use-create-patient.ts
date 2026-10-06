import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';

import { ApiError } from '@/lib/api/errors';
import { endpoints } from '@/lib/api/endpoints';
import { patientKeys, pendingKeys } from '@/lib/api/keys';
import type { PatientCreate } from '@/lib/api/types';
import { newIdempotencyKey } from '@/lib/idempotency-key';

/**
 * Registers a patient (doctors). One idempotency key per sheet session, so a double tap or a retry after a dropped
 * connection returns the first patient instead of making a second one.
 */
export function useCreatePatient() {
  const client = useQueryClient();
  const key = useRef(newIdempotencyKey());
  const mutation = useMutation({
    mutationFn: (body: PatientCreate) => endpoints.createPatient(body, key.current),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: patientKeys.all });
      void client.invalidateQueries({ queryKey: pendingKeys.all });
    },
  });
  return {
    mutation,
    /** A 409 on a possible duplicate carries the reason in its message; the form offers to confirm. */
    duplicate: mutation.error instanceof ApiError && mutation.error.status === 409,
    reset: () => {
      mutation.reset();
      key.current = newIdempotencyKey();
    },
  };
}
