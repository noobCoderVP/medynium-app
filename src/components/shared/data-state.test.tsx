import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { ApiError } from '@/lib/api/errors';

import { DataState } from './data-state';

jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));
jest.mock('expo-haptics', () => ({ impactAsync: jest.fn(), ImpactFeedbackStyle: { Light: 'light' } }));

const base = { data: undefined, isPending: false, isError: false, error: null, refetch: jest.fn() };

describe('DataState', () => {
  it('shows the data when it has loaded', async () => {
    await render(
      <DataState query={{ ...base, data: ['a'] }}>{(rows) => <Text>{`rows: ${rows.length}`}</Text>}</DataState>,
    );
    expect(await screen.findByText('rows: 1')).toBeTruthy();
  });

  it('shows the empty state', async () => {
    await render(
      <DataState
        query={{ ...base, data: [] as string[] }}
        isEmpty={(rows) => rows.length === 0}
        empty={{ title: 'Nothing yet' }}
      >
        {() => <Text>data</Text>}
      </DataState>,
    );
    expect(await screen.findByText('Nothing yet')).toBeTruthy();
    expect(screen.queryByText('data')).toBeNull();
  });

  it('shows an error with the request id and a working retry', async () => {
    const refetch = jest.fn();
    const error = new ApiError(500, 'internal', 'boom', 'req-42');
    await render(<DataState query={{ ...base, isError: true, error, refetch }}>{() => <Text>data</Text>}</DataState>);
    expect(await screen.findByText('Request req-42')).toBeTruthy();
    fireEvent.press(screen.getByText('Try again'));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('renders the same not-found for a 404, hiding the error details', async () => {
    const error = new ApiError(404, 'not_found', 'The requested resource was not found.', 'req-9');
    await render(
      <DataState query={{ ...base, isError: true, error }} notFound={<Text>Not found here</Text>}>
        {() => <Text>data</Text>}
      </DataState>,
    );
    expect(await screen.findByText('Not found here')).toBeTruthy();
    expect(screen.queryByText('Request req-9')).toBeNull();
  });
});
