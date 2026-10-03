import { formatDate, formatDateTime, formatMoney, formatNumber, formatShortDate, formatValue } from './format';

describe('format', () => {
  it('formats calendar dates without shifting the day', () => {
    expect(formatDate('2026-10-02')).toBe('2 Oct 2026');
    expect(formatShortDate('2026-01-31')).toBe('31 Jan');
  });
  it('formats instants in IST', () => {
    expect(formatDateTime('2026-10-03T08:42:00Z')).toBe('3 Oct 2026, 2:12 pm IST');
  });
  it('shows a dash for empty or invalid values', () => {
    expect(formatDate(null)).toBe('–');
    expect(formatDate('nope')).toBe('–');
    expect(formatValue(undefined)).toBe('–');
  });
  it('groups digits the Indian way', () => {
    expect(formatNumber(123456)).toBe('1,23,456');
    expect(formatNumber(999)).toBe('999');
    expect(formatMoney({ amount: 1234567.4 })).toBe('₹12,34,567');
  });
  it('trims lab values to two decimals and adds the unit', () => {
    expect(formatValue(1.2345, 'mg/dL')).toBe('1.23 mg/dL');
  });
});
