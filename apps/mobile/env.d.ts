/// <reference types="expo/types" />

declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_API_URL?: string;
    EXPO_PUBLIC_ANDROID_PACKAGE?: string;
    EXPO_PUBLIC_EAS_PROJECT_ID?: string;
    EXPO_PUBLIC_FIREBASE_TEST_PHONE?: string;
    EXPO_PUBLIC_FIREBASE_TEST_CODE?: string;
    EXPO_PUBLIC_FIREBASE_DISABLE_APP_VERIFICATION?: string;
  }
}
