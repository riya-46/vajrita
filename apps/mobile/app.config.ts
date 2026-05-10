import type { ExpoConfig } from "expo/config";

type AppConfig = ExpoConfig & {
  newArchEnabled?: boolean;
};

const config: AppConfig = {
  name: "VAJRITA",
  slug: "vajrita",
  owner: "amritashray",
  scheme: "vajrita",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "dark",
  newArchEnabled: false,
  experiments: {
    typedRoutes: true,
  },
  android: {
    package: process.env.EXPO_PUBLIC_ANDROID_PACKAGE || "com.vajrita.app",
    googleServicesFile: "./google-services.json",
    permissions: [
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION",
      "ACCESS_BACKGROUND_LOCATION",
      "POST_NOTIFICATIONS",
      "VIBRATE",
      "FOREGROUND_SERVICE",
      "FOREGROUND_SERVICE_LOCATION",
    ],
  },
  plugins: [
    "expo-router",
    "expo-dev-client",
    "expo-secure-store",
    "@react-native-firebase/app",
    "@react-native-firebase/auth",
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission:
          "Allow VAJRITA to share your live location during emergency sessions.",
        locationAlwaysPermission:
          "Allow VAJRITA to keep sharing your live location while an SOS session is active.",
        locationWhenInUsePermission:
          "Allow VAJRITA to use your location for SOS and live tracking.",
        isAndroidBackgroundLocationEnabled: true,
        isAndroidForegroundServiceEnabled: true,
      },
    ],
    "expo-notifications",
    [
      "expo-audio",
      {
        microphonePermission: "Allow VAJRITA to access your microphone if future safety features need it.",
      },
    ],
  ],
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.2:4000",
    eas: {
      projectId: "ee7fea0c-ba7c-4682-9e1e-ce9cd003bc75",
    },
  },
};

export default config;
