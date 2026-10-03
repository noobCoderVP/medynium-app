import { initials } from './avatar';

describe('initials', () => {
  it('uses the first and last name', () => {
    expect(initials('Rahul Patel')).toBe('RP');
    expect(initials('Anita Devi Sharma')).toBe('AS');
  });
  it('ignores a title and handles a single name', () => {
    expect(initials('Dr. Sharma')).toBe('S');
    expect(initials('Dr Meera Rao')).toBe('MR');
  });
  it('never returns an empty badge', () => {
    expect(initials('')).toBe('?');
  });
});
