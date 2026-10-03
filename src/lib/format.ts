// Dates are calendar dates ("2026-10-02") shown as-is, never shifted by a time zone; instants show in IST.
// Every formatter falls back to plain output so a device without full Intl support still renders text.
const IST = 'Asia/Kolkata';
const dateOnly = /^\d{4}-\d{2}-\d{2}$/;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function toDate(value: string): Date {
  return dateOnly.test(value) ? new Date(`${value}T12:00:00+05:30`) : new Date(value);
}

function plainDay(date: Date, withYear: boolean): string {
  const shifted = new Date(date.getTime() + 5.5 * 3600_000); // IST wall clock, read as UTC fields
  const day = `${shifted.getUTCDate()} ${MONTHS[shifted.getUTCMonth()]}`;
  return withYear ? `${day} ${shifted.getUTCFullYear()}` : day;
}

/** "2 Oct 2026". Empty values show a dash. */
export function formatDate(value: string | null | undefined): string {
  if (!value) return '–';
  const date = toDate(value);
  return Number.isNaN(date.getTime()) ? '–' : plainDay(date, true);
}

/** "2 Oct", for dense lists where the year is obvious. */
export function formatShortDate(value: string | null | undefined): string {
  if (!value) return '–';
  const date = toDate(value);
  return Number.isNaN(date.getTime()) ? '–' : plainDay(date, false);
}

/** "3 Oct 2026, 2:12 pm IST". */
export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '–';
  const date = toDate(value);
  if (Number.isNaN(date.getTime())) return '–';
  const shifted = new Date(date.getTime() + 5.5 * 3600_000);
  const hours = shifted.getUTCHours();
  const minutes = String(shifted.getUTCMinutes()).padStart(2, '0');
  return `${plainDay(date, true)}, ${hours % 12 || 12}:${minutes} ${hours < 12 ? 'am' : 'pm'} IST`;
}

/** Indian digit grouping: 1,23,456. */
export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '–';
  const [whole, fraction] = String(Math.abs(value)).split('.');
  const last3 = whole.slice(-3);
  const rest = whole.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  const grouped = rest ? `${rest},${last3}` : last3;
  return `${value < 0 ? '-' : ''}${grouped}${fraction ? `.${fraction}` : ''}`;
}

/** Amounts arrive as { amount, currency }; shown as ₹1,23,456. */
export function formatMoney(money: { amount: number } | null | undefined): string {
  return money ? `₹${formatNumber(Math.round(money.amount))}` : '–';
}

/** Lab values keep their own precision, trimmed to at most 2 decimals. */
export function formatValue(value: number | null | undefined, unit?: string | null): string {
  if (value === null || value === undefined) return '–';
  const text = formatNumber(Math.round(value * 100) / 100);
  return unit ? `${text} ${unit}` : text;
}

export { IST };
