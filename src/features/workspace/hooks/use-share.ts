import { useMutation } from '@tanstack/react-query';

import { endpoints } from '@/lib/api/endpoints';
import type { ShareRequest } from '@/lib/api/types';

/** Email one summary to one person. Built on the server from what the sender can already open, and audited. */
export const useSharePatient = (patientId: string) =>
  useMutation({ mutationFn: (body: ShareRequest) => endpoints.sharePatient(patientId, body) });
