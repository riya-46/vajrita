import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { BackPill } from "../../src/components/ui/SoftUI";
import { Screen } from "../../src/components/ui/Screen";
import { surfaceShadow } from "../../src/constants/theme";
import { formatDuration } from "../../src/utils/time";

export default function FakeCallActiveScreen() {
  const { callerName, callerPhone } = useLocalSearchParams<{ callerName?: string; callerPhone?: string }>();
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Screen>
      <View className="flex-1 justify-between py-6">
        <BackPill onPress={() => router.push("/(tabs)/home")} />

        <View className="mt-6 flex-1 justify-between gap-6 rounded-[30px] border border-border bg-panel p-5" style={surfaceShadow}>
          <View className="items-center gap-3 pt-8">
            <Text className="text-center text-4xl font-extrabold text-text">{callerName || "Emergency Contact"}</Text>
            <Text className="text-lg text-muted">{callerPhone}</Text>
            <Text className="mt-3 text-2xl font-semibold text-accent">{formatDuration(seconds)}</Text>
          </View>

          <View className="gap-4">
            <View className="flex-row gap-3">
              {["Mute", "Speaker", "Keypad"].map((label) => (
                <View key={label} className="flex-1 rounded-[24px] bg-accentMuted p-5">
                  <Text className="text-center font-semibold text-accent">{label}</Text>
                </View>
              ))}
            </View>
            <Pressable className="h-16 items-center justify-center rounded-full bg-[#e4473b]" onPress={() => router.replace("/(tabs)/home")}>
              <Text className="text-lg font-bold text-white">End Call</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Screen>
  );
}
