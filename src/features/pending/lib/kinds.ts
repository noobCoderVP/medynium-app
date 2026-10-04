import type { PendingItem } from '@/lib/api/types';

type Kind = PendingItem['kind'];

export const KINDS: { value: Kind; label: string }[] = [
  { value: 'ESCALATED_FINDING', label: 'Escalated' },
  { value: 'FOLLOW_UP', label: 'Follow-up due' },
  { value: 'OPEN_FINDING', label: 'Open finding' },
  { value: 'REPORT_TO_REVIEW', label: 'Report to review' },
  { value: 'ABNORMAL_LAB', label: 'Abnormal lab' },
  { value: 'RECENT_EMERGENCY', label: 'Emergency visit' },
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

export const labelFor = (kind: Kind) => KINDS.find((k) => k.value === kind)?.label ?? kind;
