import { clearScope, getOpenPatient, getRecentPatients, resetScope, setOpenPatient } from './open-patient';

describe('assistant scope', () => {
  beforeEach(() => resetScope());

  it('stays on the patient until it is cleared or changed', () => {
    setOpenPatient({ id: 'P-1', name: 'Rahul Patel' });
    expect(getOpenPatient()?.id).toBe('P-1');
    setOpenPatient({ id: 'P-2', name: 'Priya Shah' });
    expect(getOpenPatient()?.id).toBe('P-2');
    clearScope();
    expect(getOpenPatient()).toBeNull();
  });

  it('keeps recent patients newest first without duplicates', () => {
    setOpenPatient({ id: 'P-1', name: 'Rahul Patel' });
    setOpenPatient({ id: 'P-2', name: 'Priya Shah' });
    setOpenPatient({ id: 'P-1', name: 'Rahul Patel' });
    expect(getRecentPatients().map((p) => p.id)).toEqual(['P-1', 'P-2']);
  });

  it('keeps recents after clearing the scope, and forgets everything on reset', () => {
    setOpenPatient({ id: 'P-1', name: 'Rahul Patel' });
    clearScope();
    expect(getRecentPatients()).toHaveLength(1);
    resetScope();
    expect(getRecentPatients()).toHaveLength(0);
  });
});
