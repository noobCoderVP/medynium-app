import { copy } from '@/lib/copy';

import { ApiError } from './errors';

/** One place that turns any thrown error into the sentence a person reads. */
export function describeError(error: unknown): string {
  if (!(error instanceof ApiError)) return copy.errors.generic;
  if (error.status === 0) return copy.errors.network;
  if (error.status === 429) return copy.errors.rateLimited(error.retryAfter);
  if (error.status === 403) return copy.errors.forbidden;
  if (error.status === 501) return copy.errors.notImplemented;
  if (error.status === 404) return copy.errors.unavailable;
  if (error.status >= 500) return copy.errors.generic;
  return error.message || copy.errors.generic;
}
