import type { StreamAction } from '@/lib/api/events';

export interface ActionTarget {
  label: string;
  patientId: string;
  params: { tab?: string; lab?: string; from?: string; to?: string };
}

/**
 * Where an allowlisted action lands. The action only sets screen state; the workspace does the rest, so every action
 * has a manual control (FR-20). Unknown actions return null and are shown as plain text, never executed.
 */
export function targetForAction(action: StreamAction): ActionTarget | null {
  const result = action.result;
  const patientId = String(result.patient_id ?? action.params.patient_id ?? '');
  if (!patientId) return null;
  const name = typeof result.name === 'string' ? result.name : 'patient';
  if (action.action === 'open_patient') return { label: `Open ${name}`, patientId, params: {} };
  if (action.action === 'run_safety_review')
    return { label: `Open ${name}: safety review`, patientId, params: { tab: 'safety' } };
  if (action.action === 'show_timeline') {
    if (result.view === 'lab_trend' && result.lab_code) {
      return { label: `Open ${name}: lab trend`, patientId, params: { tab: 'labs', lab: String(result.lab_code) } };
    }
    return {
      label: `Open ${name}: timeline`,
      patientId,
      params: {
        tab: 'timeline',
        from: result.from ? String(result.from) : undefined,
        to: result.to ? String(result.to) : undefined,
      },
    };
  }
  return null;
}
