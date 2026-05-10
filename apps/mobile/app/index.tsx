import { Redirect } from "expo-router";
import { useAuthStore } from "../src/store/auth.store";

export default function Index() {
  const { onboardingSeen, accessToken } = useAuthStore();

  if (!onboardingSeen) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  if (!accessToken) {
    return <Redirect href="/(auth)/phone" />;
  }

  return <Redirect href="/(tabs)/home" />;
}
