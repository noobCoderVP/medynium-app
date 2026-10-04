import type { PatientEvidence, SourceEvidence } from '@/lib/api/types';
import { formatDate } from '@/lib/format';

const MAX = 70;

/** "Lisinopril tablets: prescribing information" becomes "Lisinopril". */
export function drugName(title: string): string {
  return title.split(/\s+tablets?\b|:|\s\(/i)[0].trim();
}

/** What a clinician reads in place of "P3": the value itself, with its date, trimmed to one line. */
export function recordLabel(item: PatientEvidence): string {
  const value = item.value.replace(/\s+/g, ' ').trim();
  const text = value.length > MAX ? `${value.slice(0, MAX - 1).trimEnd()}…` : value;
  return item.date && !/\b20\d\d\b/.test(text) ? `${text} · ${formatDate(item.date)}` : text;
}

/** "Lisinopril label · Warnings and precautions". */
export function sourceLabel(item: SourceEvidence): string {
  return `${drugName(item.title)} label · ${item.section}`;
}

/** The Knowledge search that shows this label section with its full citation. */
export function sourceQuery(item: SourceEvidence): string {
  return `${drugName(item.title)} ${item.section}`;
}
