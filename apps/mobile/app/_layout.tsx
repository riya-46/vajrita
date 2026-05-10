import "../global.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Loader } from "../src/components/ui/Loader";
import { useAuthBootstrap } from "../src/hooks/useAuthBootstrap";
import { useAuthStore } from "../src/store/auth.store";
import "../src/services/tracking-background";

SplashScreen.preventAutoHideAsync().catch(() => undefined);

const queryClient = new QueryClient();

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const bootstrapped = useAuthStore((state) => state.bootstrapped);
  useAuthBootstrap();

  useEffect(() => {
    if (bootstrapped) {
      setReady(true);
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [bootstrapped]);

  if (!ready) {
    return <Loader label="Preparing VAJRITA..." />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="voice-alert/index" options={{ presentation: "card" }} />
          <Stack.Screen name="risk-zones/index" options={{ presentation: "card" }} />
          <Stack.Screen name="safe-places/index" options={{ presentation: "card" }} />
          <Stack.Screen name="sos/index" options={{ presentation: "card" }} />
          <Stack.Screen name="contacts/[id]" options={{ presentation: "modal" }} />
          <Stack.Screen name="contacts/new" options={{ presentation: "modal" }} />
          <Stack.Screen name="sos/active" options={{ presentation: "card" }} />
          <Stack.Screen name="fake-call/setup" options={{ presentation: "card" }} />
          <Stack.Screen name="fake-call/index" options={{ presentation: "fullScreenModal" }} />
          <Stack.Screen name="fake-call/active" options={{ presentation: "card" }} />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
