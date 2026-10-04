# features/agent

**Purpose:** ask or do. The Ask tab: scope pill, conversation, route chip, live steps, answers, refusals and a command bar.

**Endpoints:** `POST /copilot/ask` (server-sent events, read by `src/lib/api/sse.ts` through `expo/fetch`, which streams the body). Pins from evidence use `features/evidence`.

**Requirement IDs:** FR-16 to FR-23, NFR-13, AI-01, AI-04, AI-10, SEC-11, SEC-12.

**Public surface (`index.ts`):** `AgentProvider` (mounted at the root so a conversation survives tab changes), `AgentView`.

**How it stays optional:**

- It only calls the same API as the workspace. An `action` event becomes a button (`lib/actions.ts#targetForAction`): open patient, timeline range, lab trend, safety review. The button opens the normal workspace screen with the same params, so every action has a manual control (FR-20). Unknown actions are not shown and never executed.
- Failing, rate limited or unavailable, the Ask tab shows its own state and nothing else changes.

**Scope:** the open patient comes from `lib/open-patient.ts` (set by the workspace). The pill shows its name or "No patient in scope". The server re-checks entitlement on every call; the id the app sends is never proof of access.

**Memory only:** turns live in memory and are dropped on sign-out. Nothing about a conversation is stored on the device (rule M3).

**Backgrounding:** a stream cannot survive the app leaving the foreground. It is aborted cleanly and the turn shows "Ask again", never a hang.

**States handled:** running (live steps, polite live region), answer, refusal, not found (same wording for denied and missing, handled by the answer's evidence), assistant unavailable or timeout (tab-only banner with retry), rate limited (retry-after seconds), network error, stopped by the user.

**Proposals:** when the assistant prepares a change (a note, allergy, diagnosis or medicine) the stream carries a `proposal` event and `proposal-card.tsx` shows a preview. Nothing is saved until the doctor taps Approve (`POST /agent/proposals/{id}/approve`); Discard drops it. Approving refreshes every cached query. `ask-button.tsx` (`AskButton`) lets other screens hand the assistant a question and opens the Ask tab. `last_answer_id` is sent so follow-ups have memory.
