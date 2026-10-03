# features/patients

**Purpose:** find a patient. Search by name or condition, a "changed recently" filter, and a paged list that opens the workspace.

**Endpoints:** `GET /patients` (`q`, `changed`, `limit`, `offset`), read page by page.

**Requirement IDs:** FR-02, FR-17, SEC-05, NFR-01.

**Public surface (`index.ts`):** `PatientList`.

**Rules:** the server decides who is visible; the app never filters. Search waits 300 ms after typing stops.

**States handled:** loading skeleton, empty ("No patients match"), error with retry and request id, load-more spinner and a tap-to-retry footer, pull to refresh.
