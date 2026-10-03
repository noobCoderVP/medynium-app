import * as SecureStore from 'expo-secure-store';
import { useSyncExternalStore } from 'react';

export type ThemePreference = 'system' | 'light' | 'dark';

const KEY = 'medynium.theme';
let current: ThemePreference = 'system';
const listeners = new Set<() => void>();

const isPreference = (value: unknown): value is ThemePreference =>
  value === 'system' || value === 'light' || value === 'dark';

function set(next: ThemePreference) {
  if (next === current) return;
  current = next;
  listeners.forEach((listener) => listener());
}

/** Read once at launch. A failed read leaves the system setting, never an error. */
export async function loadThemePreference(): Promise<void> {
  try {
    const stored = await SecureStore.getItemAsync(KEY);
    if (isPreference(stored)) set(stored);
  } catch {
    // keep following the system
  }
}

/** The one preference the app keeps on the device besides the sign-in tokens. It holds no clinical data. */
export function setThemePreference(next: ThemePreference): void {
  set(next);
  void SecureStore.setItemAsync(KEY, next).catch(() => {});
}

export function useThemePreference(): ThemePreference {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => current,
  );
}
