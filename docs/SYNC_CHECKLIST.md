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

Left on the web by design (not ported in this pass): command palette, focus mode, resizable assistant, create patient and add medication forms, safety finding decisions, report approve/reject, per-user patient access.

Verified 2026-10-04: `npm run check` passes (lint, format, types, 45 tests, contrast). Not yet checked on a device: see the new lines in `SMOKE_TESTS.md`.
