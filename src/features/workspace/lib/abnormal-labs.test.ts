import type { Overview } from '@/lib/api/types';

import { abnormalLabs, labDelta, refRange, whyItMatters } from './abnormal-labs';

type Lab = Overview['latest_labs'][number];
const lab = (over: Partial<Lab> = {}): Lab => ({
  lab_id: 'L1',
  test: 'Creatinine',
  code: '2160-0',
  value: 2.8,
  unit: 'mg/dL',
  date: '2026-09-02',
  previous: { value: 2.1, date: '2026-06-01' },
  ref: { low: 0.6, high: 1.3 },
  flag: 'HIGH',
  source: 'CLINICAL.LAB_RESULT',
  ...over,
});

describe('abnormal labs', () => {
  it('keeps only high and low results', () => {
    const labs = [lab(), lab({ lab_id: 'L2', flag: 'NORMAL' }), lab({ lab_id: 'L3', flag: null })];
    expect(abnormalLabs(labs).map((l) => l.lab_id)).toEqual(['L1']);
  });
  it('describes movement and the range', () => {
    expect(labDelta(lab())?.arrow).toBe('↑');
    expect(labDelta(lab({ previous: null }))).toBeNull();
    expect(refRange(lab())).toBe('0.6–1.3');
    expect(refRange(lab({ ref: { low: null, high: 1.3 } }))).toBe('≤ 1.3');
    expect(refRange(lab({ ref: { low: null, high: null } }))).toBeNull();
  });
  it('explains from recorded values only', () => {
    expect(whyItMatters(lab())).toContain('above the reference range (0.6–1.3), up from');
  });
});
