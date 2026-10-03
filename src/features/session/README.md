# features/session

**Purpose:** who is signed in. Sign-in (with the emailed code step when the deployment asks for it), forgot password, session restore on launch, sign-out.

**Endpoints:** `GET /auth/invites/{token}`, `POST /auth/invites/accept` (invitations and password resets), `POST /auth/login`, `POST /auth/login/verify`, `POST /auth/password/forgot`, `POST /auth/logout`, `GET /me`. Token refresh (`POST /auth/mobile/refresh`) lives in `src/lib/api/client.ts`, so every feature gets it.

**Requirement IDs:** SEC-01 to SEC-04 (sessions), SEC-05 (a denied patient looks missing), NFR-13.

**Public surface (`index.ts`):** `SessionProvider`, `useSession`, `SignInForm`, `OtpForm`, `ForgotPasswordForm`, `InviteForm`, `InviteLink`.

**Invitations:** route `(auth)/invite/[token]` opens from `medynium://invite/<token>` or from the sign-in screen's "I have an invitation" (paste the link or code; `lib/invite-token.ts` extracts the token). A bad, used or expired link all read "no longer valid".

**Storage:** the access and refresh tokens, in SecureStore only (`lib/auth/token-storage.ts`). The only other thing kept is the light, dark or system theme choice. The query cache is in memory and cleared on sign-out.

**Status:** `loading` (splash stays up), `signedIn`, `signedOut`, `unreachable` (a stored session exists but the API cannot be reached; the user can retry, the tokens are kept).

**States handled:** wrong password, locked account (429), network error, wrong or expired code, forgot-password confirmation that never reveals whether the email exists.
