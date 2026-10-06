import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { endpoints } from '@/lib/api/endpoints';
import { patientKeys } from '@/lib/api/keys';

/** Evidence the user chose to keep, and removing it. */
export function usePinList(patientId: string) {
  const client = useQueryClient();
  const query = useQuery({ queryKey: patientKeys.pins(patientId), queryFn: () => endpoints.pins(patientId) });
  const remove = useMutation({
    mutationFn: (pinId: string) => endpoints.removePin(patientId, pinId),
    onSuccess: () => client.invalidateQueries({ queryKey: patientKeys.pins(patientId) }),
  });
  return { query, remove };
}
