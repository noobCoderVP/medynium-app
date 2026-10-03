# features/account

**Purpose:** the You tab. Who is signed in, a way to the Activity log, change password, sign out.

**Endpoints:** `POST /auth/password` (changing it signs other devices out), plus sign-out through `features/session`.

**Requirement IDs:** SEC-01 to SEC-04.

**Public surface (`index.ts`):** `YouView`.

**States handled:** wrong current password and rate limit (message from `describeError`), success confirmation.
