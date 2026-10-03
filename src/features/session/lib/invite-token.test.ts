import { extractInviteToken } from './invite-token';

const TOKEN = 'abc123_DEF-456ghiJKL';

describe('extractInviteToken', () => {
  it('reads a web link, an app link and a bare token', () => {
    expect(extractInviteToken(`https://medynium.vercel.app/invite/${TOKEN}`)).toBe(TOKEN);
    expect(extractInviteToken(`medynium://invite/${TOKEN}`)).toBe(TOKEN);
    expect(extractInviteToken(`  ${TOKEN}  `)).toBe(TOKEN);
  });
  it('ignores a query string, a hash and a trailing slash', () => {
    expect(extractInviteToken(`https://x.app/invite/${TOKEN}/?utm=1#top`)).toBe(TOKEN);
  });
  it('rejects empty or unusable input', () => {
    expect(extractInviteToken('')).toBeNull();
    expect(extractInviteToken('https://x.app/invite/')).toBeNull();
    expect(extractInviteToken('short')).toBeNull();
    expect(extractInviteToken('not a token at all!!')).toBeNull();
  });
});
