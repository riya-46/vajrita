# VAJRITA Safety App

VAJRITA is a safety-focused mobile application being built as an npm workspace monorepo. The repository contains an Expo/React Native Android client, a Node.js/Express backend, and a shared TypeScript package for common schemas, constants, and API types.

## Status Snapshot

Last updated: May 10, 2026

- Monorepo setup is complete: `apps/mobile`, `apps/server`, and `packages/shared`
- Firebase Phone Authentication is connected on the Android app
- Firebase Admin is configured on the backend for token verification and session exchange
- EAS project setup, Android keystore setup, and cloud build configuration are complete
- The original Android Gradle blocker has been resolved
- A development Android build succeeded and produced an installable APK
- The later preview build failure was traced to JavaScript bundling issues, and those fixes are now present locally
- Local standalone bundling now succeeds, so the project is ready for a fresh preview rebuild and real-device validation

Development build artifact:

- `e3786531-5c42-4341-ae74-e66bbe89e052`
- APK: https://expo.dev/artifacts/eas/u6api44897Hvj7YFY9YDBQ.apk

## Repository Structure

```text
apps/
  mobile/   Expo + React Native client
  server/   Express + MongoDB + Socket.IO backend
packages/
  shared/   Shared constants, schemas, and API types
```

## Tech Stack

- Mobile: Expo SDK 55, React Native, TypeScript, Expo Router, NativeWind, Zustand, TanStack Query, Reanimated
- Backend: Node.js, Express, TypeScript, MongoDB, Socket.IO, Firebase Admin
- Shared: TypeScript package for shared schemas and contracts
- Integrations: Firebase Phone Auth, Twilio SMS, WhatsApp Cloud API

## Work Completed

### 1. Monorepo Foundation

- Set up the project as an npm workspace monorepo
- Created `apps/mobile`, `apps/server`, and `packages/shared`
- Wired shared package usage across mobile and backend

### 2. Backend Setup

- Scaffolded an Express + TypeScript backend
- Connected MongoDB
- Added Socket.IO
- Added Firebase Admin support for backend-side authentication flows

### 3. Mobile Setup

- Scaffolded the Expo + React Native app with the required libraries
- Connected Firebase on Android
- Registered the Android app in Firebase
- Added `google-services.json`
- Enabled Firebase Phone Authentication
- Configured Firebase test phone authentication
- Configured EAS and Android keystore support

### 4. Android Build Stabilization

- Fixed the `google-services.json` path in `app.config.ts`
- Aligned package versions to Expo SDK 55
- Cleaned up duplicate `react` and `react-native` dependencies
- Added the `expo-secure-store` plugin
- Disabled `newArchEnabled` for compatibility
- Added `react-native-worklets` to satisfy the Reanimated 4.2.1 dependency

### 5. Bundling and Workspace Fixes

- Corrected the Babel configuration so `nativewind/babel` is not treated as a plugin
- Updated the shared package source imports to Metro-compatible paths
- Verified local standalone bundling with:

```bash
npx expo export:embed --eager --platform android --dev false
```

## Build Timeline

- Gradle build `1421042a-bd34-4b9c-8bc4-e98c9b07bf8a` failed because `react-native-reanimated` required `react-native-worklets`
- That dependency issue has been fixed
- Development build `e3786531-5c42-4341-ae74-e66bbe89e052` completed successfully
- Preview build `046fe655-affa-41c2-ab9f-ce325eead2f2` failed during JavaScript bundling, not Gradle
- The preview failure was caused by Babel configuration and shared-package import resolution issues
- Both preview blockers are now fixed locally

## Current State

The project has moved from "blocked in Android build setup" to "buildable and ready for validation." The native Gradle issue is no longer the main risk. The remaining work is now focused on generating a clean standalone preview build and validating the app on a real Android device.

## Remaining Work

- Rerun the Android preview build with the latest local fixes
- Test the app end-to-end on a real Android device
- Verify Firebase OTP login, backend token exchange, and session persistence
- Verify SOS, live tracking, fake call flow, permissions, and background behavior
- Verify Twilio and WhatsApp delivery if live provider mode is required
- Replace the local backend URL with a deployed backend URL for off-network testing

## Known Operational Constraints

- The mobile app currently points to a local backend URL: `http://192.168.1.2:4000`
- Device-to-backend connectivity will fail unless the phone and backend are on the same network, or the backend is deployed publicly
- There is no automated end-to-end test suite yet
- Final confidence still depends on real-device testing

## Local Development

### Prerequisites

- Node.js 24+
- npm 11+
- Expo account
- EAS account
- Firebase project with Phone Auth enabled
- MongoDB database
- Android device for validation

### Environment Files

Create local environment files from the examples:

- `apps/mobile/.env.example` -> `apps/mobile/.env`
- `apps/server/.env.example` -> `apps/server/.env`

Do not commit local `.env` files, Firebase config files, or service-account files.
Request `apps/mobile/google-services.json` from the project maintainer and place it locally before building Android.

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

## Collaboration Workflow

- Clone the repository and install dependencies from the repo root
- Create a feature branch for each task
- Keep secrets only in local `.env` files or external credential managers
- Never commit Firebase config files, service-account JSON files, or local build artifacts
- Open pull requests for review before merging into the shared branch
- Update `.env.example` and this `README.md` whenever setup or architecture changes

Suggested branch naming:

- `feature/mobile-otp-flow`
- `feature/server-auth`
- `fix/preview-build`
- `docs/project-status`

## Security Notes

- Keep Firebase mobile config, Firebase Admin credentials, and provider secrets out of version control
- Rotate credentials immediately if any secret file is ever committed or shared
- Use `.env.example` files only for placeholders and documentation
