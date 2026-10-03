import { useMutation } from '@tanstack/react-query';

import { endpoints } from '@/lib/api/endpoints';

export const useChangePassword = () =>
  useMutation({
    mutationFn: (v: { current: string; next: string }) => endpoints.changePassword(v.current, v.next),
  });
