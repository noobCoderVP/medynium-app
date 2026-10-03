import { targetForAction } from './actions';

const act = (action: string, result: Record<string, unknown> = {}, params: Record<string, unknown> = {}) => ({
  action,
  status: 'done',
  params,
  result,
});

describe('targetForAction', () => {
  it('opens a patient', () => {
    expect(targetForAction(act('open_patient', { patient_id: 'P-1', name: 'Rahul Patel' }))).toEqual({
      label: 'Open Rahul Patel',
      patientId: 'P-1',
      params: {},
    });
  });
  it('maps the safety review and a lab trend to their tabs', () => {
    expect(targetForAction(act('run_safety_review', { patient_id: 'P-1' }))?.params).toEqual({ tab: 'safety' });
    expect(
      targetForAction(act('show_timeline', { patient_id: 'P-1', view: 'lab_trend', lab_code: '33914-3' }))?.params,
    ).toEqual({
      tab: 'labs',
      lab: '33914-3',
    });
  });
  it('passes a timeline date range', () => {
    expect(
      targetForAction(act('show_timeline', { patient_id: 'P-1', from: '2026-01-01', to: '2026-06-30' }))?.params,
    ).toEqual({
      tab: 'timeline',
      from: '2026-01-01',
      to: '2026-06-30',
    });
  });
  it('ignores unknown actions and actions with no patient', () => {
    expect(targetForAction(act('delete_everything', { patient_id: 'P-1' }))).toBeNull();
    expect(targetForAction(act('open_patient'))).toBeNull();
  });
});
