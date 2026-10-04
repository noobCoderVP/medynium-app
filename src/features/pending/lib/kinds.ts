import type { PendingItem } from '@/lib/api/types';

type Kind = PendingItem['kind'];

export const KINDS: { value: Kind; label: string }[] = [
  { value: 'ESCALATED_FINDING', label: 'Escalated finding' },
  { value: 'RECENT_EMERGENCY', label: 'Recent emergency' },
  { value: 'ABNORMAL_LAB', label: 'Abnormal lab' },
  { value: 'OPEN_FINDING', label: 'Open finding' },
  { value: 'FOLLOW_UP', label: 'Follow-up due' },
  { value: 'REPORT_TO_REVIEW', label: 'Report to review' },
];

/** Where each kind of item is dealt with, so the tap lands on the right workspace tab (same map as the web). */
export const TAB_FOR: Record<Kind, 'safety' | 'reports' | 'labs' | 'notes' | 'timeline'> = {
  ESCALATED_FINDING: 'safety',
  OPEN_FINDING: 'safety',
  REPORT_TO_REVIEW: 'reports',
  ABNORMAL_LAB: 'labs',
  FOLLOW_UP: 'notes',
  RECENT_EMERGENCY: 'timeline',
};

/** What the row's button says, so the action is clear before the tap (same wording as the web). */
export const ACTION_FOR: Record<Kind, string> = {
  ESCALATED_FINDING: 'Review finding',
  OPEN_FINDING: 'Review finding',
  REPORT_TO_REVIEW: 'Open report',
  ABNORMAL_LAB: 'Open labs',
  FOLLOW_UP: 'Open notes',
  RECENT_EMERGENCY: 'Open timeline',
};

export const labelFor = (kind: Kind) => KINDS.find((k) => k.value === kind)?.label ?? kind;
