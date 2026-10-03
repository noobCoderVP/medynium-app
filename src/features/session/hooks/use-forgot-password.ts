import { useMutation } from '@tanstack/react-query';

import { endpoints } from '@/lib/api/endpoints';

export const useForgotPassword = () =>
  useMutation({ mutationFn: (email: string) => endpoints.forgotPassword(email.trim()) });
