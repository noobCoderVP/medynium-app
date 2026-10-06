import { createContext, use, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import { ApiError, setSignedOutHandler, setTokens } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import type { LoginResponse, Me, OtpChallenge } from '@/lib/api/types';
import { tokenStorage } from '@/lib/auth/token-storage';
import { queryClient } from '@/lib/query/client';

/** `unreachable`: we hold a session but the API cannot be reached, so we ask rather than guess. */
type Status = 'loading' | 'signedIn' | 'signedOut' | 'unreachable';

interface SessionValue {
  status: Status;
  user: Me | null;
  /** Resolves to the OTP challenge when this deployment asks for the emailed code, otherwise null once signed in. */
  signIn: (email: string, password: string) => Promise<OtpChallenge | null>;
  verifyOtp: (challenge: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
  retry: () => void;
}

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<Status>('loading');
  const [user, setUser] = useState<Me | null>(null);
  const [attempt, setAttempt] = useState(0);

  const clearLocal = useCallback(async () => {
    setTokens(null);
    setUser(null);
    setStatus('signedOut');
    queryClient.clear();
    await tokenStorage.clear().catch(() => {});
  }, []);

  useEffect(() => {
    setSignedOutHandler(() => void clearLocal());
    return () => setSignedOutHandler(null);
  }, [clearLocal]);

  // Restore the session on launch (and on Retry from the unreachable screen).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await tokenStorage.get().catch(() => null);
      if (!stored) {
        if (!cancelled) setStatus('signedOut');
        return;
      }
      setTokens(stored);
      try {
        const me = await endpoints.me();
        if (cancelled) return;
        setUser(me);
        setStatus('signedIn');
      } catch (error) {
        // A 401 already signed us out through the handler. Anything else keeps the stored session.
        if (!cancelled && !(error instanceof ApiError && error.status === 401)) setStatus('unreachable');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const start = useCallback(async (result: LoginResponse) => {
    if (!result.tokens) throw new ApiError(500, 'no_tokens', 'The server did not return a session for this app.');
    setTokens(result.tokens);
    await tokenStorage.set(result.tokens);
    setUser(await endpoints.me());
    setStatus('signedIn');
  }, []);

  const value = useMemo<SessionValue>(
    () => ({
      status,
      user,
      async signIn(email, password) {
        const result = await endpoints.login(email.trim(), password);
        if ('otp_required' in result) return result;
        await start(result);
        return null;
      },
      async verifyOtp(challenge, code) {
        await start(await endpoints.verifyLogin(challenge, code));
      },
      async signOut() {
        await endpoints.logout().catch(() => {}); // best effort: local sign-out must always succeed
        await clearLocal();
      },
      retry: () => {
        setStatus('loading');
        setAttempt((n) => n + 1);
      },
    }),
    [status, user, start, clearLocal],
  );

  return <SessionContext value={value}>{children}</SessionContext>;
}

export function useSession() {
  const ctx = use(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside SessionProvider');
  return ctx;
}

/** True only once we know the caller is a doctor; record changes are doctor-only (the API re-checks). */
export const useIsDoctor = () => useSession().user?.role === 'DOCTOR';
