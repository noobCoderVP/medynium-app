import { useSyncExternalStore } from 'react';

export interface OpenPatient {
  id: string;
  name: string;
}

let current: OpenPatient | null = null;
const listeners = new Set<() => void>();

/**
 * The patient whose workspace is open, so the Ask tab can scope the assistant to it. The id only gives the assistant
 * context; the server re-checks access on every call and never treats it as proof of entitlement.
 */
export function setOpenPatient(patient: OpenPatient | null): void {
  if (current?.id === patient?.id && current?.name === patient?.name) return;
  current = patient;
  listeners.forEach((listener) => listener());
}

export function clearOpenPatient(id: string): void {
  if (current?.id === id) setOpenPatient(null);
}

export function useOpenPatient(): OpenPatient | null {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => current,
  );
}
