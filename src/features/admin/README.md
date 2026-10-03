# features/admin

**Purpose:** the everyday admin jobs on a phone: platform health, who has access, and invitations.

**Endpoints:** `GET /health/details`, `GET/PATCH /admin/users`, `GET/POST /admin/invites`, `DELETE /admin/invites/{id}`.

**Requirement IDs:** FR-02, FR-24, FR-25, SEC-04, SEC-06.

**Public surface (`index.ts`):** `AdminView`. Route `src/app/(app)/admin.tsx`, reached from the You tab for doctors flagged `is_admin`.

**Access:** hiding the entry is a courtesy; every admin endpoint refuses non-admins with `403`, which the screen shows as "Your role can't open this page."

**On the web only:** per-user patient entitlements and admin password resets.

**States handled:** loading skeleton, empty, error with retry and request id, load more, a disabled-account toggle that cannot be applied to yourself.
