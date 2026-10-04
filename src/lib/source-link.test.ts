import type { SourceRef } from '@/lib/api/types';

import { evidenceTarget, patientRoute, sourceTarget } from './source-link';

describe('source links', () => {
  it('opens a lab on its trend from the source the API names', () => {
    const source = { type: 'lab', tab: 'labs', query: { lab: 'eGFR' } } as SourceRef;
    expect(sourceTarget('P-1', source)).toEqual({ patientId: 'P-1', tab: 'labs', lab: 'eGFR' });
  });

  it('falls back to the overview with no source', () => {
    expect(sourceTarget('P-1', null)).toEqual({ patientId: 'P-1' });
  });

  it('reads the lab code from an evidence value', () => {
    expect(evidenceTarget('P-1', 'CLINICAL.LAB_RESULT', 'eGFR 42 mL/min')?.target.lab).toBe('eGFR');
  });

  it('has no link for a query result or an unknown patient', () => {
    expect(evidenceTarget('P-1', 'SQL.RESULT', 'x')).toBeNull();
    expect(evidenceTarget(null, 'CLINICAL.LAB_RESULT', 'eGFR 4')).toBeNull();
  });

  it('leaves empty params out of the route', () => {
    expect(patientRoute({ patientId: 'P-1', tab: 'overview' }).params).toEqual({ patientId: 'P-1' });
    expect(patientRoute({ patientId: 'P-1', tab: 'labs', lab: 'eGFR' }).params).toEqual({
      patientId: 'P-1',
      tab: 'labs',
      lab: 'eGFR',
    });
  });
});
