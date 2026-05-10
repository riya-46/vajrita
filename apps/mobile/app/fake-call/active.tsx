import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Screen } from "../../src/components/ui/Screen";
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
      <View className="flex-1 items-center justify-between py-12">
        <View className="items-center gap-3 pt-12">
          <Text className="text-3xl font-bold text-white">{callerName || "Emergency Contact"}</Text>
          <Text className="text-base text-muted">{callerPhone}</Text>
          <Text className="mt-3 text-2xl font-semibold text-text">{formatDuration(seconds)}</Text>
        </View>

        <View className="w-full gap-4">
          <View className="flex-row gap-3">
            {["Mute", "Speaker", "Keypad"].map((label) => (
              <View key={label} className="flex-1 rounded-3xl bg-panel p-5">
                <Text className="text-center font-semibold text-text">{label}</Text>
              </View>
            ))}
          </View>
          <Pressable className="h-16 items-center justify-center rounded-full bg-red-700" onPress={() => router.replace("/(tabs)/home")}>
            <Text className="text-lg font-bold text-white">End Call</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
