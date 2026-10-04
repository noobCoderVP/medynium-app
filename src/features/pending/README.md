# features/pending

**Purpose:** everything waiting on the signed-in clinician across their own patients (web `/pending`): escalated and open safety findings, follow-ups due, reports to review, abnormal labs, recent emergency visits.

**Endpoints:** `GET /pending` (`kind`, `limit`, `offset`), `GET /pending/summary`, `POST /patients/{id}/labs/{lab_id}/review` (doctors: "Mark reviewed" on abnormal labs).

**Requirement IDs:** FR-17, SEC-05.

**Public surface (`index.ts`):** `PendingView`.

**Rules:** the server scopes the items to the clinician's patients; the app never filters. A tap opens the patient on the tab where the item is handled (`lib/kinds.ts`, the same map as the web).

**States handled:** loading skeleton, empty ("Nothing is waiting on you."), error with retry and request id, load more, pull to refresh. Synthetic-data banner shown.
