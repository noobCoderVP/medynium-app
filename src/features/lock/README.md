# features/lock

**Purpose:** privacy on the device, even though the data is synthetic.

**What it does**

- Screenshot blocking is switched off for now so the app can be screen-recorded for demos. To restore it, call `ScreenCapture.preventScreenCaptureAsync` from `expo-screen-capture` (still installed) in `AppLockProvider`.
- After 60 seconds away the app locks behind the phone's own fingerprint, face or screen lock (`expo-local-authentication`). A full-screen cover hides everything until it is unlocked.
- A phone with no screen lock set up has nothing to unlock with, so five minutes away signs the user out instead.

**Public surface (`index.ts`):** `AppLockProvider`, `LockScreen`. Both are mounted in `src/app/(app)/_layout.tsx`, so they only exist while signed in.

**Requirement IDs:** SEC-07, SEC-08, NFR-09.

**Notes:** the lock is a local convenience on top of the server session, not a replacement for it. The tokens stay in SecureStore; signing out clears them.
