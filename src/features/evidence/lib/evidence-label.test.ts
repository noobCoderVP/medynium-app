import type { PatientEvidence, SourceEvidence } from '@/lib/api/types';

import { drugName, recordLabel, sourceLabel, sourceQuery } from './evidence-label';

const record = (value: string, date: string | null): PatientEvidence =>
  ({
    evidence_id: 'P1',
    record_type: 'LAB',
    table: 'CLINICAL.LAB_RESULT',
    record_id: 'L1',
    value,
    date,
  }) as PatientEvidence;

describe('evidence labels', () => {
  it('shortens a label title to the drug', () => {
    expect(drugName('Lisinopril tablets: prescribing information')).toBe('Lisinopril');
    expect(drugName('Metformin (extended release)')).toBe('Metformin');
  });

  it('adds the date unless the value already carries a year', () => {
    expect(recordLabel(record('eGFR 42 mL/min', '2026-09-30'))).toContain('·');
    expect(recordLabel(record('eGFR 42 on 2026-09-30', '2026-09-30'))).toBe('eGFR 42 on 2026-09-30');
  });

  it('trims long values to one line', () => {
    expect(recordLabel(record('x'.repeat(200), null)).length).toBeLessThanOrEqual(70);
  });

  it('names a label section and the search that finds it', () => {
    const source = { title: 'Lisinopril tablets: label', section: 'Warnings' } as SourceEvidence;
    expect(sourceLabel(source)).toBe('Lisinopril label · Warnings');
    expect(sourceQuery(source)).toBe('Lisinopril Warnings');
  });
});
