import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { endpoints } from '@/lib/api/endpoints';
import { adminKeys } from '@/lib/api/keys';
import type { InviteCreate, UserPatch } from '@/lib/api/types';

const PAGE = 25;

export const useHealthDetails = () => useQuery({ queryKey: adminKeys.health, queryFn: endpoints.healthDetails });

export const useUsers = () =>
  useInfiniteQuery({
    queryKey: adminKeys.users({}),
    initialPageParam: 0,
    queryFn: ({ pageParam }) => endpoints.users({ sort: 'name', order: 'asc', limit: PAGE, offset: pageParam }),
    getNextPageParam: (last) => (last.offset + last.limit < last.total ? last.offset + last.limit : undefined),
  });

export function usePatchUser() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: string; body: UserPatch }) => endpoints.patchUser(v.id, v.body),
    onSuccess: () => client.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
}

export const useInvites = () =>
  useInfiniteQuery({
    queryKey: adminKeys.invitePage({}),
    initialPageParam: 0,
    queryFn: ({ pageParam }) => endpoints.invites({ sort: 'created', order: 'desc', limit: PAGE, offset: pageParam }),
    getNextPageParam: (last) => (last.offset + last.limit < last.total ? last.offset + last.limit : undefined),
  });

export function useCreateInvite() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (body: InviteCreate) => endpoints.createInvite(body),
    onSuccess: () => client.invalidateQueries({ queryKey: ['admin', 'invites'] }),
  });
}

export function useRevokeInvite() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => endpoints.revokeInvite(id),
    onSuccess: () => client.invalidateQueries({ queryKey: ['admin', 'invites'] }),
  });
}

/** Emails the user a one-time reset link. The link is never shown here; it goes only to the account's own address. */
export const useResetPassword = () => useMutation({ mutationFn: (id: string) => endpoints.resetPassword(id) });
