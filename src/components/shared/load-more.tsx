import { Button } from '@/components/ui/button';

/** Footer for a paged list inside a scrolling page. Renders nothing when there is no next page. */
export function LoadMore({
  hasNext,
  loading,
  failed,
  onPress,
}: {
  hasNext: boolean;
  loading: boolean;
  failed: boolean;
  onPress: () => void;
}) {
  if (!hasNext && !failed) return null;
  return (
    <Button
      title={failed ? 'Could not load more. Try again' : 'Load more'}
      variant="secondary"
      loading={loading}
      onPress={onPress}
    />
  );
}
