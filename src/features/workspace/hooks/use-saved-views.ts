import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { endpoints } from '@/lib/api/endpoints';
import { patientKeys } from '@/lib/api/keys';

/** Saved views for one patient, and the two-step save: preview first, then an explicit approval (FR-22). */
export function useSavedViews(patientId: string, enabled: boolean) {
  const client = useQueryClient();
  const list = useQuery({
    queryKey: patientKeys.views(patientId),
    queryFn: () => endpoints.views(patientId),
    enabled,
  });
  const preview = useMutation({
    mutationFn: (content: Record<string, unknown>) =>
      endpoints.previewView({ kind: 'SAVED_VIEW', patient_id: patientId, content }),
  });
  const save = useMutation({
    mutationFn: (previewId: string) => endpoints.saveView(previewId, true),
    onSuccess: () => {
      preview.reset();
      return client.invalidateQueries({ queryKey: patientKeys.views(patientId) });
    },
  });
  return { list, preview, save };
}
