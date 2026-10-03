import { StyleSheet, View } from 'react-native';

import { DataState } from '@/components/shared/data-state';
import { LoadMore } from '@/components/shared/load-more';
import { Reveal } from '@/components/ui/reveal';

interface PagedQueryLike<P> {
  data: { pages: P[] } | undefined;
  isPending: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => unknown;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isFetchNextPageError: boolean;
  fetchNextPage: () => unknown;
}

/** A tab's list: the four data states, rows from every loaded page, and "Load more". */
export function PagedList<P, I>({
  query,
  getItems,
  empty,
  renderItem,
}: {
  query: PagedQueryLike<P>;
  /** The rows of one page (`items`, or `claims` for claims). */
  getItems: (page: P) => I[];
  empty: string;
  renderItem: (item: I) => React.ReactNode;
}) {
  return (
    <DataState
      query={query}
      isEmpty={(data) => data.pages.every((page) => getItems(page).length === 0)}
      empty={{ title: empty }}
    >
      {(data) => (
        <View style={styles.list}>
          {data.pages.flatMap(getItems).map((item, index) => (
            <Reveal key={index} index={index}>
              {renderItem(item)}
            </Reveal>
          ))}
          <LoadMore
            hasNext={query.hasNextPage}
            loading={query.isFetchingNextPage}
            failed={query.isFetchNextPageError}
            onPress={() => void query.fetchNextPage()}
          />
        </View>
      )}
    </DataState>
  );
}

const styles = StyleSheet.create({ list: { gap: 10 } });
