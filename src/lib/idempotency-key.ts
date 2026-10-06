/** A fresh key for one write attempt, so a double tap or a retry after a dropped connection never saves twice. */
export const newIdempotencyKey = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}-${Math.random().toString(36).slice(2, 10)}`;
