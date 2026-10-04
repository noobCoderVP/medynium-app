import * as LocalAuthentication from 'expo-local-authentication';
import { createContext, use, useCallback, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import { AppState } from 'react-native';

import { useSession } from '@/features/session';

/** Lock the app after this long away from it. */
export const LOCK_AFTER_MS = 60_000;
/** On a phone with no screen lock at all there is nothing to unlock with, so a long absence signs out instead. */
export const SIGN_OUT_AFTER_MS = 5 * 60_000;

interface LockValue {
  locked: boolean;
  /** Ask for the fingerprint, face or screen lock. Resolves true when the user is who they say. */
  unlock: () => Promise<boolean>;
}

const LockContext = createContext<LockValue | null>(null);

/**
 * Privacy for a clinical app, even with synthetic data:
 *  - after a minute away the app locks behind the phone's own fingerprint, face or screen lock;
 *  - a phone with no screen lock signs out after five minutes away.
 */
export function AppLockProvider({ children }: PropsWithChildren) {
  const { signOut } = useSession();
  const [locked, setLocked] = useState(false);
  const leftAt = useRef<number | null>(null);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active') {
        leftAt.current ??= Date.now();
        return;
      }
      const away = leftAt.current === null ? 0 : Date.now() - leftAt.current;
      leftAt.current = null;
      if (away < LOCK_AFTER_MS) return;
      void (async () => {
        const level = await LocalAuthentication.getEnrolledLevelAsync().catch(
          () => LocalAuthentication.SecurityLevel.NONE,
        );
        if (level !== LocalAuthentication.SecurityLevel.NONE) setLocked(true);
        else if (away >= SIGN_OUT_AFTER_MS) void signOut();
      })();
    });
    return () => sub.remove();
  }, [signOut]);

  const unlock = useCallback(async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock Medynium',
        cancelLabel: 'Cancel',
      });
      if (result.success) setLocked(false);
      return result.success;
    } catch {
      return false;
    }
  }, []);

  const value = useMemo(() => ({ locked, unlock }), [locked, unlock]);
  return <LockContext value={value}>{children}</LockContext>;
}

export function useAppLock() {
  const ctx = use(LockContext);
  if (!ctx) throw new Error('useAppLock must be used inside AppLockProvider');
  return ctx;
}
