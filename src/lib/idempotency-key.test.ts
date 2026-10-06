import { newIdempotencyKey } from './idempotency-key';

describe('newIdempotencyKey', () => {
  it('is different every time and fits a header', () => {
    const keys = new Set(Array.from({ length: 50 }, newIdempotencyKey));
    expect(keys.size).toBe(50);
    for (const key of keys) expect(key).toMatch(/^[a-z0-9-]{10,80}$/);
  });
});
