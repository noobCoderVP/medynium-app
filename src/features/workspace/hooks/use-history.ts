import { useQuery } from '@tanstack/react-query';

import { endpoints } from '@/lib/api/endpoints';
import { patientKeys } from '@/lib/api/keys';

/** Who changed what on this patient, newest first. Only fetched while the history sheet is open. */
export const useHistory = (patientId: string, enabled: boolean) =>
  useQuery({ queryKey: patientKeys.history(patientId), queryFn: () => endpoints.history(patientId), enabled });
