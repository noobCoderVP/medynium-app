import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { patientKeys, pendingKeys } from '@/lib/api/keys';

/** Marks an abnormal result reviewed (doctors). Repeating is harmless; the item leaves the list on success. */
export function useReviewLab() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (item: { patientId: string; labId: string }) => endpoints.reviewLab(item.patientId, item.labId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: pendingKeys.all });
      void queryClient.invalidateQueries({ queryKey: patientKeys.all });
    },
  });
  return {
    review: mutation.mutate,
    /** The lab being saved right now, so only its button shows progress. */
    savingId: mutation.isPending ? mutation.variables?.labId : undefined,
    message: mutation.error
      ? mutation.error instanceof ApiError && mutation.error.status === 403
        ? 'Only doctors can mark a result reviewed.'
        : 'That result could not be marked reviewed. Try again.'
      : null,
  };
}
