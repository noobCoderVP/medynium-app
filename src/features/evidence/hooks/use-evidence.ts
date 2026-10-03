import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { endpoints } from '@/lib/api/endpoints';
import { evidenceKeys, patientKeys } from '@/lib/api/keys';

export const useEvidence = (answerId: string | null) =>
  useQuery({
    queryKey: evidenceKeys.one(answerId ?? ''),
    queryFn: () => endpoints.evidence(answerId as string),
    enabled: !!answerId,
  });

const usePins = (patientId: string | null) =>
  useQuery({
    queryKey: patientKeys.pins(patientId ?? ''),
    queryFn: () => endpoints.pins(patientId as string),
    enabled: !!patientId,
  });

/** Pin state for the items in one answer's evidence. No pin button when the answer has no patient. */
export function useEvidencePins(patientId: string | null, answerId: string) {
  const queryClient = useQueryClient();
  const pins = usePins(patientId);
  const add = useMutation({
    mutationFn: (evidenceId: string) =>
      endpoints.addPin(patientId as string, { answer_id: answerId, evidence_id: evidenceId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: patientKeys.pins(patientId as string) }),
  });
  const pinned = new Set((pins.data?.items ?? []).filter((p) => p.answer_id === answerId).map((p) => p.evidence_id));
  return {
    isPinned: (evidenceId: string) => pinned.has(evidenceId),
    pinFor: (evidenceId: string) => (patientId ? () => add.mutate(evidenceId) : undefined),
    failed: add.isError,
  };
}
