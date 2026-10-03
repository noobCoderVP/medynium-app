import { StyleSheet, View } from 'react-native';

import { DataState } from '@/components/shared/data-state';
import { LoadMore } from '@/components/shared/load-more';
import { RecordRow } from '@/components/shared/record-row';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { describeError } from '@/lib/api/error-message';
import { formatDateTime } from '@/lib/format';

import { usePatchUser, useResetPassword, useUsers } from '../hooks/use-admin';

/** Users with their role, status and last sign-in. Disabling an account signs it out everywhere (server side). */
export function UsersList({ meId }: { meId: string | undefined }) {
  const query = useUsers();
  const patch = usePatchUser();
  const reset = useResetPassword();
  return (
    <View style={styles.list}>
      {patch.isError && (
        <Text variant="label" color="destructive" accessibilityRole="alert">
          {describeError(patch.error)}
        </Text>
      )}
      {reset.isError && (
        <Text variant="label" color="destructive" accessibilityRole="alert">
          {describeError(reset.error)}
        </Text>
      )}
      {reset.isSuccess && (
        <Text variant="label" color="success" accessibilityRole="alert">
          {reset.data.email_sent
            ? `Reset link sent to ${reset.data.email}.`
            : 'The reset email could not be sent. Try again from the web app.'}
        </Text>
      )}
      <DataState
        query={query}
        isEmpty={(d) => d.pages.every((p) => p.items.length === 0)}
        empty={{ title: 'No users yet.' }}
      >
        {(data) => (
          <>
            {data.pages
              .flatMap((page) => page.items)
              .map((user) => {
                const active = user.status === 'ACTIVE';
                return (
                  <View key={user.user_id} style={styles.item}>
                    <RecordRow
                      title={user.display_name}
                      lines={[
                        user.email,
                        `${user.role === 'DOCTOR' ? 'Doctor' : 'Assistant'}${user.is_admin ? ' · admin' : ''} · ${user.patient_count} patients`,
                        `Last sign-in ${formatDateTime(user.last_login_at)}`,
                      ]}
                      right={<Badge label={active ? 'Active' : 'Disabled'} tone={active ? 'success' : 'warning'} />}
                    />
                    <Button
                      title="Send password reset"
                      size="sm"
                      variant="ghost"
                      loading={reset.isPending && reset.variables === user.user_id}
                      onPress={() => reset.mutate(user.user_id)}
                    />
                    {user.user_id !== meId && (
                      <Button
                        title={active ? 'Disable account' : 'Enable account'}
                        size="sm"
                        variant="secondary"
                        loading={patch.isPending && patch.variables?.id === user.user_id}
                        onPress={() =>
                          patch.mutate({ id: user.user_id, body: { status: active ? 'DISABLED' : 'ACTIVE' } })
                        }
                      />
                    )}
                  </View>
                );
              })}
            <LoadMore
              hasNext={query.hasNextPage}
              loading={query.isFetchingNextPage}
              failed={query.isFetchNextPageError}
              onPress={() => void query.fetchNextPage()}
            />
          </>
        )}
      </DataState>
    </View>
  );
}

const styles = StyleSheet.create({ list: { gap: 10 }, item: { gap: 6 } });
