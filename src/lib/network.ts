import { onlineManager } from '@tanstack/react-query';
import * as Network from 'expo-network';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { env } from '@/lib/env';

type Reading = Pick<Network.NetworkState, 'isConnected' | 'isInternetReachable'>;

/**
 * `isConnected` is trustworthy. `isInternetReachable` is not: on Android it can stay false after the network comes
 * back, which left the offline banner up for good. So only a lost connection means offline; a connected device
 * that claims no internet is "unsure" and is settled by asking our own API.
 */
export function classify(state: Reading): 'online' | 'offline' | 'unsure' {
  if (state.isConnected === false) return 'offline';
  if (state.isInternetReachable === false) return 'unsure';
  return 'online';
}

const PROBE_EVERY_MS = 4_000;
const PROBE_TIMEOUT_MS = 5_000;

/** Any HTTP answer from the API proves the device is online, whatever status it carries. */
async function apiAnswers(): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
  try {
    await fetch(`${env.apiUrl}/health`, { signal: controller.signal });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Whether the phone can reach the network, kept current by the system listener, by coming back to the foreground
 * and, while the system is unsure, by a light probe of the API. Also tells react-query, so queries paused while
 * offline refetch the moment the connection returns.
 */
export function useOnline(): boolean {
  const [mode, setMode] = useState<'online' | 'offline' | 'unsure'>('online');
  const [probed, setProbed] = useState(false);

  useEffect(() => {
    let live = true;
    const apply = (state: Reading) => {
      if (!live) return;
      const next = classify(state);
      setMode(next);
      if (next !== 'unsure') setProbed(false);
    };
    const read = () => void Network.getNetworkStateAsync().then(apply, () => undefined);
    read();
    const subscription = Network.addNetworkStateListener(apply);
    const app = AppState.addEventListener('change', (status) => status === 'active' && read());
    return () => {
      live = false;
      subscription.remove();
      app.remove();
    };
  }, []);

  useEffect(() => {
    if (mode !== 'unsure') return;
    let live = true;
    const probe = async () => {
      if (await apiAnswers()) if (live) setProbed(true);
    };
    void probe();
    const timer = setInterval(() => void probe(), PROBE_EVERY_MS);
    return () => {
      live = false;
      clearInterval(timer);
    };
  }, [mode]);

  const online = mode === 'online' || (mode === 'unsure' && probed);
  useEffect(() => {
    onlineManager.setOnline(online);
  }, [online]);
  return online;
}
