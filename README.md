# VAJRITA Safety App

VAJRITA is a women-safety focused mobile application built as an npm workspace monorepo. The repository contains:

- an Expo / React Native Android client
- a Node.js / Express backend
- a shared TypeScript package for schemas, constants, and API contracts

## Project Status

Last updated: May 10, 2026

### Current Delivery Level

- The app is built and installable on Android
- Core mobile and backend flows are implemented
- A standalone Android preview APK was generated successfully
- The project is demo-ready and team-collaboration ready
- The project is not fully production-ready yet because permanent backend hosting, release OTP validation, and full real-device QA are still pending

### Latest Verified Build Results

- Successful Android development build:
  `e3786531-5c42-4341-ae74-e66bbe89e052`
  APK: `https://expo.dev/artifacts/eas/u6api44897Hvj7YFY9YDBQ.apk`
- Successful Android preview build:
  `906bcea6-8466-481d-85b1-3d4b93346e51`
  APK: `https://expo.dev/artifacts/eas/iQmFSkkB2WR4zSQWsKMiDk.apk`

### What Is Working Now

- npm workspace monorepo structure
- Expo mobile app with TypeScript, Expo Router, NativeWind, Zustand, TanStack Query, and Reanimated
- Express backend with MongoDB, Socket.IO, Firebase Admin, and TypeScript
- Shared package for common contracts and validation schemas
- Firebase phone-auth integration on Android
- Backend token exchange and session flow
- Trusted contacts flow
- SOS flow
- Live tracking flow
- Fake call flow
- Fallback provider mode without requiring Twilio or WhatsApp credentials
- GitHub collaboration workflow
- Free deployment configuration for Render
- Optional deployment configuration for Railway

## Repository Structure

```text
apps/
  mobile/   Expo + React Native Android client
  server/   Express + MongoDB + Socket.IO backend
packages/
  shared/   Shared constants, schemas, and API types
```

## Tech Stack

- Mobile: Expo SDK 55, React Native, TypeScript, Expo Router, NativeWind, Zustand, TanStack Query, Reanimated
- Backend: Node.js, Express, TypeScript, MongoDB Atlas, Socket.IO, Firebase Admin
- Shared: TypeScript package for shared constants, schemas, and API contracts
- Integrations: Firebase Phone Auth, Twilio SMS, WhatsApp Cloud API

## Work Completed

### 1. Monorepo Foundation

- Set up the project as an npm workspace monorepo
- Created `apps/mobile`, `apps/server`, and `packages/shared`
- Connected the shared package across mobile and backend

### 2. Backend Setup

- Scaffolded an Express + TypeScript backend
- Connected MongoDB Atlas
- Added Socket.IO
- Added Firebase Admin for server-side authentication and token verification
- Added API routes for auth, contacts, SOS, tracking, fake call, and public share pages

### 3. Mobile Setup

- Scaffolded the Expo + React Native app
- Connected Firebase on Android
- Registered the Android app in Firebase
- Added Android Firebase config
- Enabled Firebase Phone Authentication
- Configured Firebase test phone login for development
- Configured EAS project, Android keystore support, and cloud builds

### 4. Android Build Stabilization

- Fixed the `google-services.json` path in `app.config.ts`
- Aligned package versions to Expo SDK 55
- Cleaned duplicate `react` / `react-native` dependency issues
- Added the `expo-secure-store` plugin
- Disabled `newArchEnabled` for compatibility
- Added `react-native-worklets` for `react-native-reanimated`

### 5. Workspace and Bundling Fixes

- Corrected the Babel setup so `nativewind/babel` is used correctly
- Updated shared package imports to Metro-compatible paths
- Resolved the original Android Gradle blocker
- Resolved the later standalone bundling blocker
- Verified local Android standalone bundling

### 6. TypeScript and Environment Hardening

- Fixed mobile and server TypeScript issues
- Removed deprecated `baseUrl` usage from the shared TypeScript setup
- Added deployment-safe server origin handling
- Added support for public backend URLs instead of local-only assumptions
- Added Render and Railway deployment configs

### 7. UI and User Flow Work

- Refined the mobile interface toward a cleaner safety-app style
- Updated key mobile screens for home, contacts, tracking, fake call, SOS, risk zones, safe places, and voice alert
- Kept the app usable in fallback mode even when live SMS / WhatsApp providers are not configured

## Build Timeline

- Android Gradle build `1421042a-bd34-4b9c-8bc4-e98c9b07bf8a` failed because `react-native-reanimated` required `react-native-worklets`
- That blocker was fixed
- Android development build `e3786531-5c42-4341-ae74-e66bbe89e052` completed successfully
- Preview build `046fe655-affa-41c2-ab9f-ce325eead2f2` failed during JavaScript bundling
- The preview failure was traced to Babel configuration and shared package path resolution
- Those preview blockers were fixed locally
- Preview build `906bcea6-8466-481d-85b1-3d4b93346e51` completed successfully and produced an installable APK

## Current State

The project has moved from "blocked in Android build setup" to "buildable, installable, and ready for deeper validation."

The app can now be installed and opened on Android using the latest preview APK. However, the project should still be treated as a pre-release build rather than a fully production-ready public release.

## What Still Remains

- Deploy the backend to a permanent public host
- Point the mobile app to that permanent backend URL and rebuild the Android app
- Test the full app end-to-end on a real Android device
- Verify Firebase OTP login with release-style signing fingerprints
- Validate SOS, live tracking, fake call, background permissions, and session persistence on a real device
- Switch to live Twilio / WhatsApp credentials only if real provider delivery is required

## Known Limitations

- The currently tested public backend path used a temporary Cloudflare Quick Tunnel; that is useful for testing but not for long-term public use
- Permanent backend hosting is still pending
- Real production OTP validation still depends on adding the final Android signing SHA fingerprints in Firebase
- There is no automated end-to-end mobile/backend test suite yet

## Deployment Model

Use this architecture for real user access:

```text
Android app -> public backend URL -> MongoDB Atlas
```

The mobile app should never connect directly to MongoDB Atlas.

## Free and Paid Deployment Options

### Render Free Hosting

The repository includes [render.yaml](./render.yaml) for a free web-service deployment.

- Best free persistent hosting option for this repo
- Good for team demos and testing
- Free services may spin down when idle

### Railway

The repository also includes [railway.json](./railway.json).

- Works well for public hosting
- Usually simpler operationally
- May require paid usage depending on account limits

### Cloudflare Quick Tunnel

- Useful for temporary testing from any network
- No long-term guarantee
- Your laptop must stay on while the tunnel is active

## Accounts Required

Required for the current core scope:

- Firebase project
- Expo / EAS account
- MongoDB Atlas project
- GitHub repository
- Public backend host such as Render or Railway

Optional, only if live provider delivery is needed:

- Twilio account for real SMS sending
- Meta WhatsApp Cloud API account for real WhatsApp alerts

## Local Development

### Prerequisites

- Node.js 24+
- npm 11+
- Expo account
- EAS account
- Firebase project with Phone Auth enabled
- MongoDB Atlas database
- Android device for validation

### Environment Files

Create local environment files from the examples:

- `apps/mobile/.env.example` -> `apps/mobile/.env`
- `apps/server/.env.example` -> `apps/server/.env`

### Firebase Android Config

`apps/mobile/google-services.json` is intentionally tracked in this repository because Android EAS cloud builds require it to be uploaded with the project.

This file is client-side Firebase app configuration, not a Firebase Admin secret.

### Install Dependencies

```bash
cmd /c npm install --legacy-peer-deps
```

### Run the Backend

```bash
cmd /c npm run dev:server
```

### Run the Mobile App

```bash
cmd /c npm run dev:mobile
```

### Build Commands

Development build:

```bash
cd apps/mobile
cmd /c npx eas build --profile development --platform android
```

Preview build:

```bash
cd apps/mobile
cmd /c npx eas build --profile preview --platform android
```

## Real Device Validation Checklist

- Install the latest preview APK on Android
- Verify login using the configured Firebase test phone flow
- Verify token exchange and session restore
- Add and verify trusted contacts
- Trigger SOS and confirm fallback provider behavior
- Start and stop live tracking
- Test fake call setup and execution
- Confirm location, notification, and background-permission behavior

For real production OTP validation:

- remove or disable the Firebase test-phone values from `apps/mobile/.env`
- add the Android SHA-1 and SHA-256 fingerprints for the final signing key in Firebase
- rebuild the Android app after those Firebase changes

## Collaboration Workflow

- Clone the repository
- Install dependencies from the repo root
- Create a feature branch for each task
- Keep secrets only in local `.env` files or approved secret managers
- Open pull requests before merging into `main`
- Update `.env.example` files and this `README.md` whenever setup or architecture changes

Suggested branch naming:

- `feature/mobile-otp-flow`
- `feature/server-auth`
- `feature/public-deployment`
- `fix/preview-build`
- `docs/project-status`

## Security Notes

- Do not commit local `.env` files
- Do not commit Firebase Admin service-account JSON files
- Do not commit provider secrets
- Rotate credentials immediately if any secret is leaked
- Keep `.env.example` files limited to placeholders and documentation
