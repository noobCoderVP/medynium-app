# Web to mobile sync checklist

Started 2026-10-04. Source of truth is `medynium-ui`; the API contract is `medynium-apis/docs/api/openapi.json`.
Each step is done only when `npm run check` passes.

- [x] 0. Regenerate API types (`npm run api:types`), baseline `npm run check`
- [x] 1. Bug: "offline" banner stays after the connection returns (also wire react-query's online manager so screens refetch)
- [x] 2. Feedback: sign-in, forgot-password and invite screens vertically centred
- [x] 3. Bottom nav: five options (Home, Patients, Pending, Ask, More); Knowledge, Activity, Account and Admin live under More
- [x] 4. Pending work screen (web `/pending`): kind filter chips, summary line, overdue marks, deep link to the right patient tab
- [x] 5. Patient header: allergy line on every tab (web allergy banner)
- [x] 6. Overview: "Needs attention" safety panel with reference range and movement, "Review safety" action (web attention panel)
- [x] 7. Similar patients tab
- [x] 8. Reports tab: list, upload (expo-document-picker, approved 2026-10-04), row accept/reject, approve and reject report
- [x] 9. Documentation screen (web `/docs`)
- [x] 10. Docs: READMEs, SMOKE_TESTS, plan status; final `npm run check`

Second pass, 2026-10-04 (web changes after the first sync):

- [x] 11. Regenerate API types from the latest OpenAPI
- [x] 12. Stream: `rule_check` tag (answers carrying it were being dropped by validation), per-statement `patient_id` and `group` for panel answers, `proposal` events, `last_answer_id` so follow-up questions have memory
- [x] 13. Clinical brief on Overview (attention, what changed with previous visit / 90 days / 1 year, missing information, optional written summary); each line opens the tab or lab it came from; the lab-only attention panel remains as the fallback while the brief loads or fails
- [x] 14. Overview trimmed like the web: medicines live on their own tab; utilisation is "Last 12 months"
- [x] 15. Assistant proposals: preview card with Approve and Discard; approving refreshes every cached query
- [x] 16. "Brief me" and "Explain" buttons hand a question to the assistant and open the Ask tab
- [x] 17. Evidence in words under each statement ("Based on"), each opening the lab, medicine, note or label (Knowledge search is pre-filled through a `q` param), plus Details for the Why? sheet
- [x] 18. Activity: assistant metrics card (volume, wait, approvals, routes, tools, slowest steps)
- [x] 19. Screenshot blocking removed so the app can be screen-recorded for demos

Not ported (web only): the attention chip menu in the patient header, findings decisions, command palette, focus mode, resizable assistant, record forms.

Left on the web by design (not ported in this pass): command palette, focus mode, resizable assistant, create patient and add medication forms, safety finding decisions, report approve/reject, per-user patient access.

Verified 2026-10-04: `npm run check` passes (lint, format, types, 45 tests, contrast). Not yet checked on a device: see the new lines in `SMOKE_TESTS.md`.
