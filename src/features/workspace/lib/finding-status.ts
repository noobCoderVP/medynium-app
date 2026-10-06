import type { FindingStatus } from '@/lib/api/types';

type Tone = 'success' | 'warning' | 'destructive' | 'muted';

/** Status wording and tone, the same as the web. Every status is shown as words as well as colour. */
export const STATUS: Record<FindingStatus, { label: string; tone: Tone }> = {
  NEW: { label: 'Needs a decision', tone: 'warning' },
  ACKNOWLEDGED: { label: 'Acknowledged', tone: 'success' },
  FLAGGED: { label: 'Follow-up set', tone: 'warning' },
  DISMISSED: { label: 'Dismissed', tone: 'muted' },
  ESCALATED: { label: 'Escalated', tone: 'destructive' },
};
