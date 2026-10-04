import { normalizeOverview } from './normalize';
import type { Overview } from './types';

describe('normalizeOverview', () => {
  it('fills missing lists so screens can loop over them', () => {
    const result = normalizeOverview({ patient_id: 'P-1' } as unknown as Overview);
    expect(result.diagnoses).toEqual([]);
    expect(result.medications).toEqual([]);
    expect(result.latest_labs).toEqual([]);
    expect(result.recent_events).toEqual([]);
  });

  it('leaves allergies undefined when the server did not send them', () => {
    expect(normalizeOverview({ patient_id: 'P-1' } as unknown as Overview).allergies).toBeUndefined();
  });
});
