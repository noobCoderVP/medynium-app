# Medynium mobile: implementation plan

Status (2026-10-03): **All phases built.** Decisions taken: D1 bearer mode (done in `medynium-apis`), D2 LAN for development, D3 dependency list (plus `test-renderer` and `@react-native/jest-preset`, peers of the test tooling).

| Phase | State |
| --- | --- |
| 0 Backend readiness, scaffold, first EAS dev build | Done |
| 1 Foundation and sign-in | Done |
| 2 Dashboard and patients | Done |
| 3 Patient workspace | Done, including email summary and saved views |
| 4 Evidence (Why?) | Done |
| 5 Agent (Ask) | Done |
| 6 Knowledge, activity, You, admin | Done (admin: health, users, password reset links, invitations; per-user patient access stays on the web) |
| 7 Quality and release | Contrast check, unit and component tests, smoke list, branding, motion pass, screenshot blocking and biometric or screen-lock auto-lock, theme choice, invitation links. Not done: a TalkBack walk-through (needs a person and a phone), crash reporting (needs a Sentry DSN), the release APK after on-device checks |

Design: the web's tokens (oklch converted to sRGB), Roboto headings and Inter body, the web header's logo (HeartPulse in a rounded primary square) on every tab and as the app icon and splash. Motion: press scale on every control, staggered list and section entrances, tab icon spring, spring bottom sheets that follow a drag, typing dots while the assistant works, all honouring the system reduce-motion setting.

Written 2026-10-03.

React Native (Expo) client for the same governed Patient 360 and clinical agent that `medynium-ui` serves on the web. Synthetic data only; decision support, not diagnosis. It talks only to `medynium-apis`; no Snowflake and no secrets on the device.

Reference app for tooling: `Desktop/Tutorial/Android_Development/nexora-app` (builds and installs on a phone today).

## 1. What we reuse from Nexora (known-good)

| Area | Copy from Nexora | Medynium change |
| --- | --- | --- |
| Stack | Expo SDK 57, RN 0.86, React 19.2, expo-router, TS strict, `@/*` path alias, React Compiler, typed routes | none |
| Data | `@tanstack/react-query`, `zod`, `expo-secure-store` | **no query-cache persistence** (see rule M3) |
| Build | `eas.json` profiles (development / preview / release / production, APK for internal), `scripts/build-eas.ps1` (typecheck, lint, then `eas build`), `metro.config.js` | new slug `medynium`, package `com.medynium.app`, new EAS project |
| Config | `app.json` shape, adaptive icon, splash, `userInterfaceStyle: automatic`, `expo-dev-client` | drop widgets, speech, Sentry and notifications plugins at first |
| Android hardening | `plugins/with-android-hardening.js` (`allowBackup=false`) | keep as is: patient data must not reach Drive backups |
| API client | `lib/api/client.ts` pattern: base URL from `EXPO_PUBLIC_API_URL`, 20 s timeout, `ApiError`, single 401 handler | rebuilt around Medynium's error shape `{error, message}` and refresh flow |
| Theme | tokens in `constants/theme.ts`, `use-theme` hook | new palette after design direction (rule 9 below) |

Not reused now: `react-native-android-widget`, `expo-widgets`, `expo-speech-recognition`, `expo-notifications`, Sentry. They are what forced Nexora onto a dev client and caused the `work-runtime-ktx` plugin; leaving them out keeps the first builds clean. Sentry can come back in the release phase.

## 2. What the app does (scope)

Mirrors the web screens, rebuilt for a phone, not ported pixel for pixel (the prototype and web styling are behaviour references only).

| Web | Mobile | Phase |
| --- | --- | --- |
| Sign-in, OTP, forgot password | Same; session kept in SecureStore | 1 |
| Dashboard (tiles, worklist, briefing) | Home tab | 2 |
| Patients list, search, filters | Patients tab | 2 |
| Patient workspace, 7 tabs | Screen with a segmented tab bar: Overview, Timeline, Medications, Labs (trend chart), Claims, Notes, Safety | 3 |
| Why? evidence drawer | Bottom sheet, opened from any tagged statement (no hover) | 4 |
| Agent panel (SSE) | Ask tab / sheet with live steps, route chip, refusals | 5 |
| Knowledge search | Knowledge tab | 6 |
| Activity log | Inside You tab | 6 |
| Saved views, pins, share | Pins and share on patient; saved views with preview then approve | 6 |
| Admin (users, invites) | **Deferred**: low value on a phone; web only until asked | later |
| Invite accept, password reset links | Deep link `medynium://` after the web flow works | later |

Navigation: bottom tabs `Home / Patients / Ask / Knowledge / You`; patient workspace is a stack screen above Patients.

## 3. Decisions that need your approval before Phase 1

### D1. Auth for mobile (the one real blocker)

The backend authenticates with **HttpOnly cookies** (`med_access`, refresh cookie scoped to `/auth`) plus a CSRF header `X-Medynium-Client: web`. That design suits a browser behind the Next.js proxy. On a phone it is fragile: the native cookie jar is opaque to JS, refresh-cookie path scoping and `Secure` rules differ, and tokens cannot go to SecureStore.

Recommended: add a **bearer mode to `medynium-apis`**, additive and web-safe:

1. `POST /auth/login` and `/auth/login/verify`: when header `X-Medynium-Client: mobile` is sent, also return `{access, refresh}` in the body (cookies not set).
2. `POST /auth/refresh`: accept the refresh token in the body for `mobile` clients; rotation and reuse detection stay as they are.
3. `require_session`: accept `Authorization: Bearer <access>` when no cookie is present. Same token, same verification, same Snowflake role derivation.
4. CSRF middleware: accept `mobile` as well as `web`. CSRF does not apply to bearer requests, but we keep the header as a client identifier for logs.
5. Tests: web cookie path unchanged; bearer path covered; wrong token, expired token and refresh reuse covered.

This touches auth, so it needs your explicit yes. Alternative (not recommended): rely on the native cookie jar with `credentials: "include"`; it may work on Android but cannot be tested reliably across app restarts and token rotation.

### D2. Where the API runs for the phone

GCP deploy is Stage 8 and not done. Until then the phone reaches the API through your PC's LAN IP (`EXPO_PUBLIC_API_URL=http://192.168.x.x:8000`, cleartext allowed in dev builds only) or an ngrok tunnel (Nexora already has `@expo/ngrok`). Release builds require HTTPS, so a release APK waits for the Cloud Run URL. Which do you want for development: **LAN** (recommended, free) or tunnel?

### D3. Dependencies

Per the workspace rule, no dependency without approval. Proposed list, all at the versions Nexora already runs:

`expo`, `expo-router`, `expo-constants`, `expo-linking`, `expo-secure-store`, `expo-status-bar`, `expo-splash-screen`, `expo-system-ui`, `expo-font`, `expo-haptics`, `expo-network`, `expo-sharing`, `expo-dev-client`, `react-native-safe-area-context`, `react-native-screens`, `react-native-gesture-handler`, `react-native-reanimated`, `react-native-worklets`, `react-native-svg` (lab trend chart), `@expo/vector-icons`, `@shopify/flash-list` (long lists), `@tanstack/react-query`, `react-hook-form`, `@hookform/resolvers`, `zod`; dev: `jest`, `jest-expo`, `@testing-library/react-native`, `eslint`, `eslint-config-expo`, `typescript`, `openapi-typescript`, `prettier`.

For the Why? sheet and dialogs I will use React Native's own `Modal` plus gesture-handler, not a sheet library. For SSE I will use `expo/fetch` (streaming body), which ships with Expo; no extra package.

## 4. Mobile rules (inherited from the web rules, adapted)

- **M1. API only through `src/lib/api/client.ts`.** Hooks call it; components never do. No Snowflake, no secrets; only `EXPO_PUBLIC_*` is bundled.
- **M2. Types come from `openapi.json`** (`npm run api:types` into `src/lib/api/schema.d.ts`, never hand-edited). The stream and answer object are zod-validated at the boundary, exactly like `medynium-ui/src/lib/api/events.ts`.
- **M3. No clinical data at rest on the device.** Only tokens in SecureStore. No React Query persistence, no AsyncStorage of patient data (this is the opposite of Nexora). Cache lives in memory and is cleared on sign-out and on 401. `allowBackup=false` stays.
- **M4. Synthetic-data banner** on every screen that shows patient data.
- **M5. A denied patient looks like a missing one:** same not-found state, no header, no tabs, no hint.
- **M6. Manual parity:** every agent action has a manual control; the workspace works with the agent unavailable.
- **M7. Evidence everywhere:** each answer statement shows its tag (Patient fact / Retrieved source / AI synthesis) as text plus icon, and a tap opens Why?.
- **M8. Every data screen has loading, empty, error-with-retry and agent-unavailable states**, plus an offline banner (Nexora's `offline-banner` pattern).
- **M9. Accessibility:** touch targets at least 44 px, `accessibilityLabel`/role on every control, dynamic type respected, contrast checked in light and dark, no colour-only status, no hover-only content.
- **M10. Visual design waits for design direction** (same as web rule 9). Phases 1 to 5 use neutral Nexora-style zinc tokens behind a single `theme.ts`, so restyling is a one-file change.
- **M11. Modular:** `src/app/**` holds thin route files only; each feature is `src/features/<name>/{components,hooks,lib,types.ts,README.md}` with a context card; no feature imports another feature's internals (public `index.ts` only, lint-enforced); one component per file, at most 200 lines.
- **M12. Model choice for build sessions:** Sonnet or Haiku class only.

## 5. Phases

Each phase ends with a **done-when** that I run before moving on: `npm run check` (typecheck, lint, tests) green, plus the device check listed. I stop at the end of each phase for your confirmation.

### Phase 0: Backend readiness and project scaffold (about half a day)

- Run `medynium-apis` locally; confirm `/health` from the phone's browser over LAN (settles D2 early).
- If D1 approved: implement the bearer mode in `medynium-apis` with tests; `poe openapi`; commit in that repo.
- Scaffold `medynium-app/` from Nexora's config: `package.json`, `app.json`, `eas.json`, `metro.config.js`, `tsconfig.json`, `eslint.config.js`, `.gitignore`, `.env.example`, `plugins/with-android-hardening.js`, `scripts/build-eas.ps1`; `AGENTS.md`/`CLAUDE.md` with the rules above; own git repo.
- Add the lint rule for feature boundaries and the 200-line limit.
- First EAS `development` build (cloud; Windows cannot build locally), install, open to a placeholder screen.
- **Done when:** the dev-client APK installs and opens, `npm run check` green, phone reaches `/health` through the app.

### Phase 1: Foundation and sign-in

- `lib/api`: `client.ts` (timeout, `ApiError` from `{error,message}`, request id, `Retry-After`, 401 then single shared refresh then retry, then sign out), `endpoints.ts` (ported from the web file), `events.ts` and SSE parser (ported; pure logic and tests carry over), `types.ts` aliases, `api:types` script.
- `lib/auth`: SecureStore token storage, session provider, route guard (`(auth)` vs `(app)` groups), sign-out clears the query cache.
- `features/session`: sign-in, OTP step, forgot password, `me`.
- Shared UI: `Screen`, `Button`, `Input`, `Card`, `Skeleton`, `StatePanels` (loading, empty, error-retry, not found, rate limited), `OfflineBanner`, `SyntheticBanner`, theme tokens and dark mode.
- **Done when:** sign in with a seeded doctor (and the assistant) on the phone, kill the app, reopen and stay signed in; wrong password shows the right error; expired access token refreshes silently; sign-out lands on sign-in. Unit tests for client, refresh, SSE parser, storage.

### Phase 2: Dashboard and patients (web slice 3, no AI)

- Home: utilisation tiles, worklist with change flags, recent lab and medication changes, "Brief me" (on request only, never on load).
- Patients: search, filters, paginated list (FlashList), pull to refresh.
- Tab bar shell, per-screen README cards.
- **Done when:** both seeded users see only their own patients (the assistant never sees S3, matching the web); all four states render for each screen (verified by killing the API and by an empty account); banner visible.

### Phase 3: Patient workspace (Patient 360)

- Gate screen: loads the patient first; denied equals missing (M5).
- Header (name, as-of date), tab bar, then one feature folder per tab: Overview, Timeline (date-range and type filters), Medications, Labs (latest list plus SVG trend chart with reference band, accessible text alternative), Claims, Notes (list and detail), Safety (reads the saved review; agent-unavailable state here only).
- Share and pins (read), recent-changes strip.
- **Done when:** every tab matches the web's data for S1 to S5 patients; opening a denied patient id shows the identical not-found screen as a random id; chart readable in dark mode.

### Phase 4: Evidence (Why?)

- `features/evidence`: tagged `AnswerView`, `RefButton`, bottom-sheet `EvidenceDrawer` (patient records, SQL, sources), honest-gap rendering for a safety answer with no statements, pin an item.
- Deep link state kept in route params (`why`, `stmt`, `ref`) so back button closes the sheet.
- **Done when:** a safety review's statement opens its evidence with a tap and screen reader announces the sheet; not found and error-retry states pass; tags are text plus icon, not colour only.

### Phase 5: Agent (Ask)

- `features/agent`: provider, scope pill (open patient or "No patient in scope"), SSE via `expo/fetch`, live steps, route chip, answer, refusal view, rate limit countdown, stop/cancel, suggestions.
- Actions map to navigation (open patient, timeline range, lab, safety) so each has a manual control (M6).
- Keyboard-aware input; the workspace keeps working when the agent fails.
- **Done when:** the hero flow works on the phone (safety review question with evidence, a refusal, a routed lookup); backgrounding and returning mid-stream ends cleanly with a retry, never a hang; agent-unavailable shows a banner only in the Ask tab.

### Phase 6: Knowledge, activity, saved views

- Knowledge search (drug and section filters, citations open Why?-style source view, corpus status), Activity log (audit list, pagination), saved views (preview then "Approve and save"), You tab (profile, change password, theme, sign out, support and privacy links).
- **Done when:** all demo steps D1 to D8 of the implementation plan run on the phone; denial and audit rows appear for the access test.

### Phase 7: Quality, hardening, release

- Test pass: component tests for each state, hook tests, an end-to-end checklist file (`SMOKE_TESTS.md`, Nexora style) for the hero flow.
- Accessibility audit with TalkBack and font scale 200 percent; contrast script on the tokens (mirror the web `check-contrast`).
- Security: HTTPS-only in release, `allowBackup=false`, `FLAG_SECURE` (blocks screenshots and the recents preview) evaluated, auto-lock after inactivity evaluated, token never logged, no PHI in logs or crash reports.
- Performance: cold start, list scroll, SSE first token.
- Release: Sentry (scrubbed) optional, `release` APK against the Cloud Run URL, install on your phone, run the smoke test; production AAB profile ready but not submitted.
- **Done when:** a standalone APK (no Expo server) passes the smoke test on your phone against the deployed API.

## 6. Risks

| Risk | Mitigation |
| --- | --- |
| Cookie auth does not suit mobile | D1 bearer mode, tested before any UI depends on it |
| SSE does not stream in RN `fetch` | `expo/fetch` streaming; spike in Phase 0 against `/copilot/ask`, fallback is chunked polling of the same answer endpoint |
| Cloud Run not deployed yet | LAN/tunnel for dev; release APK is the last step |
| No local Android builds on Windows | EAS cloud builds (as Nexora); JS-only changes ride on the dev client with no rebuild; keep native deps minimal so rebuilds are rare |
| SDK 57 API drift | Read `docs.expo.dev/versions/v57.0.0` before using any Expo API (Nexora's own rule) |
| PHI on device | M3, SecureStore only, no persistence, backups off |
| Web and mobile contract drift | one `openapi.json`; `api:types` in the check script fails on a diff |

## 7. Order of work and what I need from you

1. Approve D1 (bearer mode in `medynium-apis`), D2 (LAN vs tunnel) and D3 (dependency list).
2. Tell me if admin and invite deep links stay deferred, and whether you already have design direction for the mobile look (otherwise zinc tokens, restyle later).
3. Then I start Phase 0 and stop for your check at the end of each phase.
