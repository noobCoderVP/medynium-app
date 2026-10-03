import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { DataState } from '@/components/shared/data-state';
import { LoadMore } from '@/components/shared/load-more';
import { RecordRow } from '@/components/shared/record-row';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { describeError } from '@/lib/api/error-message';
import { formatDateTime } from '@/lib/format';

import { useInvites, useRevokeInvite } from '../hooks/use-admin';
import { CreateInviteSheet } from './create-invite-sheet';

export function InvitesList({ meId }: { meId: string | undefined }) {
  const query = useInvites();
  const revoke = useRevokeInvite();
  const [creating, setCreating] = useState(false);
  return (
    <View style={styles.list}>
      <Button title="Invite someone" icon="person-add-outline" onPress={() => setCreating(true)} />
      {revoke.isError && (
        <Text variant="label" color="destructive" accessibilityRole="alert">
          {describeError(revoke.error)}
        </Text>
      )}
      <DataState
        query={query}
        isEmpty={(d) => d.pages.every((p) => p.items.length === 0)}
        empty={{ title: 'No invitations yet.' }}
      >
        {(data) => (
          <>
            {data.pages
              .flatMap((page) => page.items)
              .map((invite) => (
                <View key={invite.invite_id} style={styles.item}>
                  <RecordRow
                    title={invite.display_name}
                    lines={[
                      invite.email,
                      `${invite.kind === 'INVITE' ? 'Invitation' : 'Password reset'} · ${invite.role === 'DOCTOR' ? 'Doctor' : 'Assistant'}`,
                      `Expires ${formatDateTime(invite.expires_at)}`,
                    ]}
                    right={<Badge label={invite.status} tone={invite.status === 'PENDING' ? 'info' : 'muted'} />}
                  />
                  {invite.status === 'PENDING' && (
                    <Button
                      title="Revoke"
                      size="sm"
                      variant="secondary"
                      loading={revoke.isPending && revoke.variables === invite.invite_id}
                      onPress={() => revoke.mutate(invite.invite_id)}
                    />
                  )}
                </View>
              ))}
            <LoadMore
              hasNext={query.hasNextPage}
              loading={query.isFetchingNextPage}
              failed={query.isFetchNextPageError}
              onPress={() => void query.fetchNextPage()}
            />
          </>
        )}
      </DataState>
      <CreateInviteSheet visible={creating} onClose={() => setCreating(false)} supervisorId={meId} />
    </View>
  );
}

const styles = StyleSheet.create({ list: { gap: 10 }, item: { gap: 6 } });
