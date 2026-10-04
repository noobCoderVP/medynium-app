import { classify } from './network';

describe('classify', () => {
  it('is offline only when the connection is lost', () => {
    expect(classify({ isConnected: false, isInternetReachable: false })).toBe('offline');
    expect(classify({ isConnected: false, isInternetReachable: undefined })).toBe('offline');
  });
  it('is online when connected, including while reachability is still unknown', () => {
    expect(classify({ isConnected: true, isInternetReachable: true })).toBe('online');
    expect(classify({ isConnected: true, isInternetReachable: undefined })).toBe('online');
    expect(classify({ isConnected: undefined, isInternetReachable: undefined })).toBe('online');
  });
  it('does not trust a stale "no internet" on a connected device', () => {
    expect(classify({ isConnected: true, isInternetReachable: false })).toBe('unsure');
  });
});
