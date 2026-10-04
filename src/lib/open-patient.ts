import { useSyncExternalStore } from 'react';

export interface OpenPatient {
  id: string;
  name: string;
}

const MAX_RECENT = 6;

let current: OpenPatient | null = null;
let recent: OpenPatient[] = [];
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

/**
 * The patient the assistant is asking about. It is sticky: opening a patient's workspace sets it and it stays until the
 * user picks another patient or chooses "All my patients", so switching tabs never silently drops the patient. The id
 * only gives the assistant context; the server re-checks access on every call and never treats it as proof of access.
 */
export function setOpenPatient(patient: OpenPatient): void {
  const changed = current?.id !== patient.id || current?.name !== patient.name;
  const rest = recent.filter((p) => p.id !== patient.id);
  const next = [patient, ...rest].slice(0, MAX_RECENT);
  if (changed || recent[0]?.id !== patient.id) {
    current = patient;
    recent = next;
    notify();
  }
}

/** Go back to questions about all of the clinician's own patients. */
export function clearScope(): void {
  if (current === null) return;
  current = null;
  notify();
}

/** Forget everything (sign-out). */
export function resetScope(): void {
  current = null;
  recent = [];
  notify();
}

/** Plain reads of the same state, for code outside React and for tests. */
export const getOpenPatient = () => current;
export const getRecentPatients = () => recent;

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useOpenPatient(): OpenPatient | null {
  return useSyncExternalStore(subscribe, () => current);
}

/** Patients opened recently in this session, newest first, for a quick pick. Memory only. */
export function useRecentPatients(): OpenPatient[] {
  return useSyncExternalStore(subscribe, () => recent);
}
