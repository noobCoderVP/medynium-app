import type { TabKey } from '../components/patient-workspace';

/** Starter questions for the assistant, chosen by the open tab. */
export const SUGGESTIONS: Record<TabKey, string[]> = {
  overview: ['Brief me on this patient', 'What changed since the last visit?', 'What is missing from the record?'],
  timeline: ['What changed recently?', 'Show the timeline for the last 3 months'],
  medications: ['What medicines is this patient on?', 'Run the safety review'],
  labs: ['Which results are flagged?', 'Show the eGFR trend'],
  safety: ['Run the safety review', 'What does the label say about the current medicines?'],
  claims: ['Summarise the claims and utilisation'],
  notes: ['Summarise this patient'],
  reports: ['What changed since the last report?'],
  similar: ['Which of my patients are most like this one?'],
};
