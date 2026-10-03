import { useMutation, useQuery } from '@tanstack/react-query';

import { endpoints } from '@/lib/api/endpoints';

/** Who an invitation or reset link is for. Public; a bad or expired link is a 404. */
export const useInvitePreview = (token: string) =>
  useQuery({ queryKey: ['invite', token], queryFn: () => endpoints.invitePreview(token), retry: false });

export const useAcceptInvite = (token: string) =>
  useMutation({ mutationFn: (password: string) => endpoints.acceptInvite(token, password) });
