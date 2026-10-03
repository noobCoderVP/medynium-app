# features/activity

**Purpose:** "What happened, and when." The signed-in user's audit rows: each question, action, route, model and outcome, denials included.

**Endpoints:** `GET /audit` (`sort`, `order`, `limit`, `offset`). The server returns only the caller's own rows.

**Requirement IDs:** FR-24, SEC-09, AI-04.

**Public surface (`index.ts`):** `ActivityView`. Route: `src/app/(app)/activity.tsx`, opened from the You tab.

**States handled:** loading skeleton, empty, error with retry and request id, load more, pull to refresh.
