import { router } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "../../src/components/ui/Button";
import { Header } from "../../src/components/ui/Header";
import { Screen } from "../../src/components/ui/Screen";
import { setSecureValue, storageKeys } from "../../src/services/secure-storage";
import { useAuthStore } from "../../src/store/auth.store";

export default function OnboardingScreen() {
  const setOnboardingSeen = useAuthStore((state) => state.setOnboardingSeen);

  const handleContinue = async () => {
    await setSecureValue(storageKeys.onboardingSeen, "true");
    setOnboardingSeen(true);
    router.replace("/(auth)/phone");
  };

  return (
    <Screen
      header={<Header title="Stay one tap away from help" subtitle="Fast SOS, trusted contacts, live tracking, and fake call tools built for panic situations." />}
    >
      <View className="flex-1 justify-between pb-10">
        <View className="gap-4 rounded-3xl border border-border bg-panel p-5">
          <Text className="text-emergency text-accent">SOS</Text>
          <Text className="text-base leading-7 text-muted">
            VAJRITA is designed to minimize friction during emergencies. Every primary action is reachable within two taps.
          </Text>
          <View className="gap-3">
            {["OTP secured access", "Verified trusted contacts", "Live location sharing", "Fake incoming call"].map(
              (item) => (
                <View key={item} className="rounded-2xl bg-panelMuted p-4">
                  <Text className="text-base font-semibold text-text">{item}</Text>
                </View>
              ),
            )}
          </View>
        </View>
        <Button onPress={handleContinue}>Continue</Button>
      </View>
    </Screen>
  );
}
