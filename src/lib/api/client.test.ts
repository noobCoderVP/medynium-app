import { ApiError, apiFetch, setSignedOutHandler, setTokens } from './client';

jest.mock('@/lib/auth/token-storage', () => ({ tokenStorage: { set: jest.fn().mockResolvedValue(undefined) } }));
jest.mock('@/lib/env', () => ({ env: { apiUrl: 'http://api.test' } }));

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(status === 204 ? null : JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });

function stub(...responses: Response[]) {
  const fn = jest.fn();
  for (const response of responses) fn.mockResolvedValueOnce(response);
  global.fetch = fn as unknown as typeof fetch;
  return fn;
}

const headersOf = (fn: jest.Mock, call: number) => fn.mock.calls[call][1].headers as Record<string, string>;

beforeEach(() => {
  setTokens({ access: 'a1', refresh: 'r1' });
  setSignedOutHandler(null);
});

describe('apiFetch', () => {
  it('calls the API base URL with the mobile client header and the bearer token', async () => {
    const fn = stub(json({ status: 'ok' }));
    await apiFetch('/health');
    expect(fn.mock.calls[0][0]).toBe('http://api.test/health');
    expect(headersOf(fn, 0)).toMatchObject({ Authorization: 'Bearer a1', 'X-Medynium-Client': 'mobile' });
  });

  it('turns the error contract into an ApiError with request id and retry-after', async () => {
    stub(json({ error: 'rate_limited', message: 'Slow down.' }, 429, { 'X-Request-Id': 'req-1', 'Retry-After': '30' }));
    const error = await apiFetch('/x').catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 429, code: 'rate_limited', requestId: 'req-1', retryAfter: 30 });
  });

  it('reports a network failure as status 0', async () => {
    global.fetch = jest.fn().mockRejectedValue(new TypeError('Network request failed')) as unknown as typeof fetch;
    await expect(apiFetch('/x')).rejects.toMatchObject({ status: 0, code: 'network' });
  });

  it('refreshes once on 401, retries with the new token and stores it', async () => {
    const fn = stub(
      json({ error: 'unauthorized', message: 'x' }, 401),
      json({ access: 'a2', refresh: 'r2' }),
      json({ ok: true }),
    );
    await expect(apiFetch('/me')).resolves.toEqual({ ok: true });
    expect(fn.mock.calls[1][0]).toBe('http://api.test/auth/mobile/refresh');
    expect(JSON.parse(fn.mock.calls[1][1].body)).toEqual({ refresh: 'r1' });
    expect(headersOf(fn, 2).Authorization).toBe('Bearer a2');
  });

  it('shares one refresh between concurrent 401s', async () => {
    const unauthorized = () => json({ error: 'unauthorized', message: 'x' }, 401);
    const fn = stub(
      unauthorized(),
      unauthorized(),
      json({ access: 'a2', refresh: 'r2' }),
      json({ n: 1 }),
      json({ n: 2 }),
    );
    await Promise.all([apiFetch('/a'), apiFetch('/b')]);
    const refreshes = fn.mock.calls.filter((c) => String(c[0]).endsWith('/auth/mobile/refresh'));
    expect(refreshes).toHaveLength(1);
  });

  it('signs out when the refresh fails', async () => {
    const out = jest.fn();
    setSignedOutHandler(out);
    stub(
      json({ error: 'unauthorized', message: 'x' }, 401),
      json({ error: 'unauthorized', message: 'x' }, 401),
      json({}, 401),
    );
    await expect(apiFetch('/me')).rejects.toMatchObject({ status: 401 });
    expect(out).toHaveBeenCalledTimes(1);
  });

  it('does not refresh for auth routes (a wrong password is just a 401)', async () => {
    const fn = stub(json({ error: 'invalid_credentials', message: 'No.' }, 401));
    await expect(apiFetch('/auth/login', { method: 'POST', body: {} })).rejects.toMatchObject({ status: 401 });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('returns undefined for 204', async () => {
    stub(json(null, 204));
    await expect(apiFetch('/auth/logout', { method: 'POST' })).resolves.toBeUndefined();
  });
});
