<!-- expo-agent-rules -->
# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before using any Expo API.

# AGENTS.md: medynium-app

React Native (Expo SDK 57) client for Medynium. It talks only to `medynium-apis`; no Snowflake and no secrets on the device. Plan: `docs/plan/README.md`. Parent rules: `../AGENTS.md` (model choice: Sonnet, Haiku or Llama class, never Opus).

## Commands

- `npm run check` (lint, format, types, tests): run before every commit
- `npm run api:types`: regenerate `src/lib/api/schema.d.ts` from `../medynium-apis/docs/api/openapi.json` (never hand-edit)
- `npm start` (dev client), `npm run build:android` (EAS cloud build; Windows cannot build locally)
- Dev API: run `poe start` in `medynium-apis`, set `EXPO_PUBLIC_API_URL=http://<PC LAN IP>:8000` in `.env`

## Rules that must not be broken

1. API only through `src/lib/api/client.ts`; hooks call it, components never do (lint-enforced). Only `EXPO_PUBLIC_*` is bundled.
2. Types come from the OpenAPI file. Stream and answer payloads are zod-validated at the boundary.
3. No clinical data at rest: tokens in SecureStore only; no query-cache persistence, no AsyncStorage of patient data. Cache is in memory, cleared on sign-out.
4. Synthetic-data banner on every screen that shows patient data.
5. A denied patient looks like a missing one: the same not-found state, no hint.
6. Manual parity: every agent action has a manual control; the workspace works with the agent failing.
7. Evidence everywhere: tagged statements open Why? with a tap.
8. Every data screen has loading, empty, error-with-retry and agent-unavailable states.
9. Accessibility: 44 px targets, labels and roles, dynamic type, contrast in light and dark, never colour alone.
10. No visual styling decisions beyond `src/constants/theme.ts` until design direction arrives.
11. No new dependency without asking.

## Structure

`src/app/**` is thin route files. Each feature is `src/features/<name>/{components,hooks,lib,types.ts,README.md,index.ts}`; import a feature through its `index.ts` only. One component per file, at most 200 lines. Keep each feature README card current.

## Auth

Mobile uses bearer tokens (`X-Medynium-Client: mobile`; `tokens` in the login body; `POST /auth/mobile/refresh`). The web keeps its cookies. Do not change one path without the other's tests.
