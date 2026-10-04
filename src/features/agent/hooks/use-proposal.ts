import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { endpoints } from '@/lib/api/endpoints';
import { ApiError } from '@/lib/api/errors';

export type ProposalState =
  | { phase: 'idle' }
  | { phase: 'saving' }
  | { phase: 'saved'; patientId: string; tab: string }
  | { phase: 'discarded' }
  | { phase: 'failed'; message: string };

/**
 * Approve or discard one prepared change. Approving calls the same service the manual screens use, as the signed-in
 * clinician; on success every cached query is refreshed so the new record shows at once.
 */
export function useProposal(proposalId: string) {
  const [state, setState] = useState<ProposalState>({ phase: 'idle' });
  const client = useQueryClient();

  const approve = async () => {
    setState({ phase: 'saving' });
    try {
      const done = await endpoints.approveProposal(proposalId);
      await client.invalidateQueries();
      setState({ phase: 'saved', patientId: done.patient_id, tab: done.tab });
    } catch (error) {
      const api = error instanceof ApiError ? error : null;
      setState({
        phase: 'failed',
        message:
          api?.code === 'not_found'
            ? 'This prepared change has expired. Ask again to prepare it.'
            : (api?.message ?? 'The change could not be saved.'),
      });
    }
  };

  const discard = async () => {
    setState({ phase: 'saving' });
    try {
      await endpoints.discardProposal(proposalId);
    } catch {
      // An expired proposal is already gone; the card closes either way.
    }
    setState({ phase: 'discarded' });
  };

  return { state, approve, discard };
}
