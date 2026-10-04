# features/evidence

**Purpose:** prove an answer. The tagged answer view and the Why? bottom sheet that lists the patient records, SQL and sources behind each statement.

**Endpoints:** `GET /evidence/{answer_id}`, `GET/POST /patients/{id}/pins` (pin an item).

**Requirement IDs:** FR-08, FR-09, NFR-05, NFR-10, AI-05, AI-07, AI-08.

**Public surface (`index.ts`):** `AnswerView`, `EvidenceProvider`, `useEvidenceDrawer`.

**How it opens:** `EvidenceProvider` is mounted once at the root and owns the sheet. Any screen calls `useEvidenceDrawer().open({ answerId, statementId })`. Nothing is passed through props or the URL; the Android back button closes the sheet.

**Rules it carries:**

- Three tags, never mixed: Patient fact, Retrieved source, AI synthesis. Each is icon shape plus text. Synthesis always shows the hedge from `lib/copy.ts`.
- A safety answer with no statements renders as the honest gap (what was checked, what was not, snapshot date), never as "no risk".
- No hover: every reference is a button.
- Someone else's answer and a missing one both show the same not-found state.

**States handled:** loading skeleton, error with retry and request id, not found, empty evidence.

**In words, with links:** under each statement `evidence-chips.tsx` lists the lab, medicine or label section it rests on ("Based on"), each opening the real record through `lib/source-link.ts` (labs on their trend, label sections in Knowledge via a `q` param), plus Details for the Why? sheet. The `rule_check` tag marks lines found by a fixed rule rather than a model.
