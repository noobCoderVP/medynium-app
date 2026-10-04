# features/account

**Purpose:** the More tab. Who is signed in, theme, links to Knowledge, Activity, Documentation and Admin, change password, sign out.

**Endpoints:** `POST /auth/password` (changing it signs other devices out), plus sign-out through `features/session`.

**Requirement IDs:** SEC-01 to SEC-04.

**Public surface (`index.ts`):** `YouView`.

**States handled:** wrong current password and rate limit (message from `describeError`), success confirmation.
