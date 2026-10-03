import { fetch as streamFetch } from 'expo/fetch';

import { env } from '@/lib/env';
import { tokenStorage, type Tokens } from '@/lib/auth/token-storage';

import { ApiError } from './errors';
import type { Health } from './types';

export { ApiError } from './errors';
export type { Health } from './types';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: Method;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  /** Set on streams: the response is returned unparsed and no timeout applies. */
  accept?: string;
}

const TIMEOUT_MS = 20_000;

let tokens: Tokens | null = null;
let onSignedOut: (() => void) | null = null;
let refreshInFlight: Promise<boolean> | null = null;

export function setTokens(next: Tokens | null): void {
  tokens = next;
}

/** Called when the session is dead (refresh failed). The session provider clears state and shows sign-in. */
export function setSignedOutHandler(handler: (() => void) | null): void {
  onSignedOut = handler;
}

async function toApiError(response: Response): Promise<ApiError> {
  const body = (await response.json().catch(() => null)) as {
    error?: string;
    message?: string;
    details?: unknown;
  } | null;
  const retryAfter = Number(response.headers.get('Retry-After'));
  return new ApiError(
    response.status,
    body?.error ?? 'unknown',
    body?.message ?? response.statusText,
    response.headers.get('X-Request-Id'),
    Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : null,
    body?.details ?? null,
  );
}

const networkError = (aborted: boolean) =>
  new ApiError(
    0,
    aborted ? 'timeout' : 'network',
    aborted ? 'The request timed out. Try again.' : 'We could not reach the server.',
  );

async function send(path: string, options: RequestOptions): Promise<Response> {
  const method = options.method ?? 'GET';
  const stream = options.accept === 'text/event-stream';
  const controller = new AbortController();
  const timer = stream ? null : setTimeout(() => controller.abort(), TIMEOUT_MS);
  options.signal?.addEventListener('abort', () => controller.abort());
  // expo/fetch exposes the response body as a stream; React Native's own fetch does not.
  const doFetch: typeof fetch = stream ? (streamFetch as unknown as typeof fetch) : fetch;
  try {
    return await doFetch(`${env.apiUrl}${path}`, {
      method,
      signal: controller.signal,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      headers: {
        Accept: options.accept ?? 'application/json',
        'X-Medynium-Client': 'mobile',
        ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(tokens ? { Authorization: `Bearer ${tokens.access}` } : {}),
        ...options.headers,
      },
    });
  } catch (error) {
    if (options.signal?.aborted) throw error;
    throw networkError(error instanceof Error && error.name === 'AbortError');
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/** One refresh at a time; concurrent 401s share it. Returns false when the session cannot continue. */
function refreshSession(): Promise<boolean> {
  refreshInFlight ??= (async () => {
    const current = tokens;
    if (!current) return false;
    try {
      const response = await send('/auth/mobile/refresh', { method: 'POST', body: { refresh: current.refresh } });
      if (!response.ok) return false;
      const next = (await response.json()) as Tokens;
      tokens = next;
      await tokenStorage.set(next).catch(() => {});
      return true;
    } catch {
      return false;
    }
  })().finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

/** Call to /api paths. On 401 it refreshes once and retries, then signs out. Auth routes never trigger a refresh. */
export async function request(path: string, options: RequestOptions = {}): Promise<Response> {
  let response = await send(path, options);
  if (response.status === 401 && !path.startsWith('/auth/') && tokens) {
    if (await refreshSession()) response = await send(path, options);
    if (response.status === 401) {
      onSignedOut?.();
      throw await toApiError(response);
    }
  }
  if (!response.ok) throw await toApiError(response);
  return response;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await request(path, options);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const get = <T>(path: string, signal?: AbortSignal) => apiFetch<T>(path, { signal });
export const post = <T>(path: string, body?: unknown, headers?: Record<string, string>) =>
  apiFetch<T>(path, { method: 'POST', body, headers });
export const put = <T>(path: string, body: unknown) => apiFetch<T>(path, { method: 'PUT', body });
export const patch = <T>(path: string, body: unknown) => apiFetch<T>(path, { method: 'PATCH', body });
export const del = <T = void>(path: string) => apiFetch<T>(path, { method: 'DELETE' });

export const getHealth = () => get<Health>('/health');
