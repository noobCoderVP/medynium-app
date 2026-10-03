import type { TabKey } from '../components/patient-workspace';

export interface ViewParams {
  from?: string;
  to?: string;
  lab?: string;
}

const TABS: TabKey[] = ['overview', 'timeline', 'medications', 'labs', 'claims', 'notes', 'safety'];
const KEYS: (keyof ViewParams)[] = ['from', 'to', 'lab'];

/** What a saved view stores: the tab and its filters (date range, lab code), nothing clinical. */
export function contentFromState(title: string, tab: TabKey, params: ViewParams): Record<string, unknown> {
  const kept: Record<string, string> = {};
  for (const key of KEYS) if (params[key]) kept[key] = params[key] as string;
  return { title, tab, params: kept };
}

/** Reads stored content back. Unknown content falls back to the overview, and only known keys are read. */
export function stateFromContent(content: Record<string, unknown>): { tab: TabKey; params: ViewParams } {
  const tab = TABS.find((t) => t === content.tab) ?? 'overview';
  const params: ViewParams = {};
  const raw = content.params;
  if (raw && typeof raw === 'object') {
    for (const key of KEYS) {
      const value = (raw as Record<string, unknown>)[key];
      if (typeof value === 'string') params[key] = value;
    }
  }
  return { tab, params };
}
