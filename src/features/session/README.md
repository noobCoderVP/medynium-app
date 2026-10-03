# features/session

**Purpose:** who is signed in. Sign-in (with the emailed code step when the deployment asks for it), forgot password, session restore on launch, sign-out.

**Endpoints:** `POST /auth/login`, `POST /auth/login/verify`, `POST /auth/password/forgot`, `POST /auth/logout`, `GET /me`. Token refresh (`POST /auth/mobile/refresh`) lives in `src/lib/api/client.ts`, so every feature gets it.

**Requirement IDs:** SEC-01 to SEC-04 (sessions), SEC-05 (a denied patient looks missing), NFR-13.

**Public surface (`index.ts`):** `SessionProvider`, `useSession`, `SignInForm`, `OtpForm`, `ForgotPasswordForm`.

**Storage:** the access and refresh tokens, in SecureStore only (`lib/auth/token-storage.ts`). Nothing else persists; the query cache is in memory and cleared on sign-out.

**Status:** `loading` (splash stays up), `signedIn`, `signedOut`, `unreachable` (a stored session exists but the API cannot be reached; the user can retry, the tokens are kept).

**States handled:** wrong password, locked account (429), network error, wrong or expired code, forgot-password confirmation that never reveals whether the email exists.
