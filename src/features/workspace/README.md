# features/workspace

**Purpose:** everything about one patient, in one place. A header (who, as-of date), seven sections chosen by a chip row (Overview, Timeline, Medicines, Labs, Claims, Notes, Safety), and the gate that decides what to show.

**Endpoints:** `GET /patients/{id}` (header and Overview, one call), `.../timeline`, `.../medications`, `.../labs`, `.../labs/{code}/trend`, `.../claims`, `.../notes`, `.../notes/{id}`, and `POST .../safety-review` (server-sent events, read by `src/lib/api/sse.ts`).

**Requirement IDs:** FR-03 to FR-09, FR-16, FR-20, FR-22, SEC-05, NFR-10.

**Route:** `src/app/(app)/patient/[patientId].tsx`. Search params `tab`, `lab`, `from`, `to` let the assistant's actions land on a section; each is also a manual control, so every agent action has a manual path (FR-20).

**The gate (`components/patient-workspace.tsx`):** loads the patient first. A denied patient and a missing one both fail with the same 404 and render the same "We couldn't find that patient." state, with no header, no tabs and no content (SEC-05). Tab content only renders after the patient has loaded.

**Lists:** each tab shows pages with a "Load more" button, so the screen scrolls as one document.

**Labs:** a trend sheet with an SVG line and a shaded reference band; the same values are listed as text beneath it.

**Safety:** the manual Run safety review. Steps stream in live; the answer opens Why? through `features/evidence`. When the assistant is unavailable only this tab says so; the record stays usable (NFR-13). The last answer is kept in the in-memory cache only.

**States handled:** loading skeleton, not found, error with retry and request id, empty list per tab, rate limited, assistant unavailable (Safety only).

**Not yet built:** share a summary, saved views.
