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

## Web sync (2026-10-04)

Tabs now match the web order: Overview, Timeline, Medicines, Labs, Safety, Claims, Notes, Reports, Similar.

- Header shows allergies (`allergy-line.tsx`); an empty list reads "No allergies recorded".
- Overview opens with `attention-panel.tsx` (out-of-range labs with range and movement, from `lib/abnormal-labs.ts`, recorded values only).
- Similar: `GET /patients/{id}/similar`. Reports: `GET /patients/{id}/reports` and `.../reports/{id}`, with upload (`expo-document-picker`, raw bytes via `postBlob`), per-row accept/reject, approve and reject report.

- Overview opens with the clinical brief (`clinical-brief.tsx`, `brief-attention.tsx`, `brief-changes.tsx`, `brief-gaps.tsx`; `GET /patients/{id}/brief`, `/brief/summary`, `/changes`): rule-made, no model except the optional written summary. Each line opens its record through `onOpenTarget`. `attention-panel.tsx` stays as the fallback while the brief loads or fails.

**Patient summary (Overview):** stored markdown summary from `GET /patients/{id}/summary`; written once on first open, rewritten only by Refresh (`POST .../summary/refresh`, about 15 s). Shows who/when, a "record changed since" note, and a rules-made label when the model was down. Rendered by `components/shared/markdown.tsx` (native text only).

## Web sync (2026-10-06)

- **Safety tab** now carries the findings workflow: "Add to findings" under every AI-synthesis or rule-check conclusion (`raise-finding-button.tsx`, via `AnswerView`'s `statementAction`), the findings list with Acknowledge, Follow up (date), Escalate (colleague) and Dismiss (reason) (`findings-card.tsx`, `decision-form.tsx`), and the pinned-evidence list (`pins-card.tsx`). Endpoints: `GET/POST /patients/{id}/findings`, `PATCH /findings/{id}`, `GET /patients/{id}/colleagues`, `GET/DELETE /patients/{id}/pins`. Pending items of kind finding already land here.
- **History**: the clock icon in the header opens `history-sheet.tsx` (`GET /patients/{id}/history`), the audit trail of who changed what.
- **Add medicine** (doctors only, `useIsDoctor`): `add-medication-sheet.tsx` on the Medicines tab, `POST /patients/{id}/medications` with an idempotency key per sheet session. The API re-checks the role.
- Dates are typed as YYYY-MM-DD and validated before send (no new date-picker dependency).
