import type { Overview } from './types';

/**
 * The server and the app are released separately, so an older server can omit a field the app now reads. Lists a
 * screen loops over are made safe here, once, so a missing one can never crash a screen.
 * `allergies` is deliberately left undefined when absent: "unknown" must never be shown as "none recorded".
 */
export function normalizeOverview(overview: Overview): Overview {
  return {
    ...overview,
    diagnoses: overview.diagnoses ?? [],
    medications: overview.medications ?? [],
    latest_labs: overview.latest_labs ?? [],
    recent_events: overview.recent_events ?? [],
  };
}
