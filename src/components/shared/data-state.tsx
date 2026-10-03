import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ListSkeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { describeError } from '@/lib/api/error-message';
import { ApiError, isNotFound } from '@/lib/api/errors';

interface QueryLike<T> {
  data: T | undefined;
  isPending: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => unknown;
}

/** Error panel with retry and the request id, so a failure can be traced in the audit log. */
export function ErrorPanel({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const requestId = error instanceof ApiError ? error.requestId : null;
  return (
    <View style={styles.error} accessibilityRole="alert">
      <Text variant="heading">Something went wrong</Text>
      <Text color="mutedForeground" style={styles.center}>
        {describeError(error)}
      </Text>
      {requestId && (
        <Text variant="caption" color="mutedForeground">
          Request {requestId}
        </Text>
      )}
      {onRetry && <Button title="Try again" size="sm" onPress={onRetry} />}
    </View>
  );
}

/**
 * The four states every data screen needs (rule 8): loading, empty, error with retry, and the data itself.
 * `notFound` replaces the error panel for a 404, so a denied record and a missing one look the same.
 */
export function DataState<T>({
  query,
  isEmpty,
  empty,
  notFound,
  skeleton,
  children,
}: {
  query: QueryLike<T>;
  isEmpty?: (data: T) => boolean;
  empty?: { title: string; description?: string };
  notFound?: ReactNode;
  skeleton?: ReactNode;
  children: (data: T) => ReactNode;
}) {
  if (query.isPending) return <>{skeleton ?? <ListSkeleton rows={4} />}</>;
  if (query.isError) {
    if (notFound && isNotFound(query.error)) return <>{notFound}</>;
    return <ErrorPanel error={query.error} onRetry={() => void query.refetch()} />;
  }
  const data = query.data as T;
  if (isEmpty?.(data))
    return <EmptyState title={empty?.title ?? 'Nothing here yet'} description={empty?.description} />;
  return <>{children(data)}</>;
}

const styles = StyleSheet.create({
  error: { alignItems: 'center', gap: 8, paddingVertical: 32, paddingHorizontal: 24 },
  center: { textAlign: 'center' },
});
