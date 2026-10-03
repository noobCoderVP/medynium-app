/** The API error contract: { error, message }. Every response also carries X-Request-Id. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly requestId: string | null = null,
    readonly retryAfter: number | null = null,
    readonly details: unknown = null,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Denied and missing are the same thing to the UI (SEC-05). Never branch on which one it was. */
export const isNotFound = (error: unknown): boolean => error instanceof ApiError && error.status === 404;

export const isAgentUnavailable = (error: unknown): boolean =>
  error instanceof ApiError && (error.code === 'agent_unavailable' || error.code === 'timeout');

export const isRateLimited = (error: unknown): boolean => error instanceof ApiError && error.status === 429;

export const isNotImplemented = (error: unknown): boolean => error instanceof ApiError && error.status === 501;

/** Retry policy for React Query: never retry a 4xx, retry a 5xx once. */
export function shouldRetry(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiError && error.status < 500) return false;
  return failureCount < 1;
}
