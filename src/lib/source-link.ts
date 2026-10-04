import type { SourceRef } from '@/lib/api/types';

/** Where in the workspace a record opens: the tab, and a lab code when the record is a lab. */
export interface WorkspaceTarget {
  patientId: string;
  tab?: string;
  lab?: string;
}

/**
 * The workspace screen that opens the record an item came from: a lab opens its trend, a medicine the Medicines tab.
 * The API names the tab and any extra parameters; this only shapes them for the router.
 */
export function sourceTarget(patientId: string, source: SourceRef | null | undefined): WorkspaceTarget {
  if (!source) return { patientId };
  return { patientId, tab: source.tab, lab: source.query?.lab };
}

/** The same, from a stored evidence row (table and record id) for the Why? sheet. Null when the row has no screen. */
export function evidenceTarget(
  patientId: string | null | undefined,
  table: string,
  value: string,
): { target: WorkspaceTarget; label: string } | null {
  if (!patientId) return null;
  switch (table) {
    case 'CLINICAL.LAB_RESULT': {
      const code = /^[A-Za-z][A-Za-z0-9 ]*?(?=\s+-?\d)/.exec(value)?.[0]?.trim();
      return { target: { patientId, tab: 'labs', lab: code }, label: 'Open the lab' };
    }
    case 'CLINICAL.MEDICATION':
      return { target: { patientId, tab: 'medications' }, label: 'Open medicines' };
    case 'CLINICAL.CLINICAL_NOTE':
      return { target: { patientId, tab: 'notes' }, label: 'Open notes' };
    case 'CLINICAL.DIAGNOSIS':
    case 'CLINICAL.ALLERGY':
      return { target: { patientId }, label: 'Open overview' };
    case 'CLINICAL.ENCOUNTER':
      return { target: { patientId, tab: 'timeline' }, label: 'Open timeline' };
    case 'CLINICAL.CLAIM':
      return { target: { patientId, tab: 'claims' }, label: 'Open claims' };
    case 'CLINICAL.REPORT':
      return { target: { patientId, tab: 'reports' }, label: 'Open the report' };
    case 'ANALYTICS.FINDING':
      return { target: { patientId, tab: 'safety' }, label: 'Open findings' };
    default:
      return null;
  }
}

/** Router params for the patient screen, without the empty ones. */
export function patientRoute(target: WorkspaceTarget) {
  const params: Record<string, string> = { patientId: target.patientId };
  if (target.tab && target.tab !== 'overview') params.tab = target.tab;
  if (target.lab) params.lab = target.lab;
  return { pathname: '/patient/[patientId]' as const, params };
}
