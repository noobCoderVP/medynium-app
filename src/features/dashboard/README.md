# features/dashboard

**Purpose:** "Show me my patients and who changed." Utilisation tiles, what changed, the worklist with change flags, and "Brief me". First screen after sign-in (Home tab).

**Endpoints:** `GET /dashboard` (one call). `GET /dashboard/briefing` runs only when Brief me is pressed; it is rules over the dashboard data (no model call) and the card says so.

**Requirement IDs:** FR-17, FR-18, NFR-01, SEC-08.

**Public surface (`index.ts`):** `DashboardView`.

**Data scope:** whatever the API returns for the signed-in user. The assistant's list excludes S3 because the server's row policy does; the app never filters.

**States handled:** loading skeleton, empty worklist (explains why), error with retry and request id, rate limited (message from `describeError`), pull to refresh. Agent-unavailable does not apply: this screen makes no agent call.

**Synthetic banner:** shown under the title.
