# Medynium mobile

React Native (Expo SDK 57) client for the governed Patient 360 and clinical agent. Synthetic data only; decision support, not diagnosis. Plan and phases: [docs/plan/README.md](docs/plan/README.md). Working rules: [AGENTS.md](AGENTS.md).

## Run

1. API: in `medynium-apis`, `poe start` (listens on all interfaces; allow port 8000 through the Windows firewall for private networks).
2. `cp .env.example .env` and set `EXPO_PUBLIC_API_URL` to `http://<your PC LAN IP>:8000` (phone and PC on the same Wi-Fi).
3. `npm install`, then build the dev client once: `npx eas-cli build --profile development --platform android` and install the APK.
4. `npm start`, open the dev client and scan the QR code.

The deployed API is `https://medynium-api-uujbhqhgzq-el.a.run.app` (Cloud Run); `eas.json` sets it for every build profile. To use a local API instead, set `EXPO_PUBLIC_API_URL` in `.env` to `http://<your PC LAN IP>:8000` and use the `development` profile, which allows plain HTTP (set `MEDYNIUM_CLEARTEXT=1`). Release and production builds are HTTPS-only.
