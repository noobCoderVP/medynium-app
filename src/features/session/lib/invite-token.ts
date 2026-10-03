/**
 * Pulls the token out of whatever the person pastes: the emailed link (`https://host/invite/<token>`, with or without a
 * query string, or `medynium://invite/<token>`) or the bare token. Returns null when nothing usable is there.
 */
export function extractInviteToken(input: string): string | null {
  const text = input.trim();
  if (!text) return null;
  const withoutQuery = text.split(/[?#]/)[0].replace(/\/+$/, '');
  const last = withoutQuery.split('/').pop() ?? '';
  const token = decodeURIComponent(last);
  // The API accepts 10 to 200 characters of URL-safe text.
  return /^[A-Za-z0-9_-]{10,200}$/.test(token) ? token : null;
}
