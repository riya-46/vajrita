import { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Vibration, Pressable, Text, View } from "react-native";
import { useAudioPlayer } from "expo-audio";
import { BackPill } from "../../src/components/ui/SoftUI";
import { Screen } from "../../src/components/ui/Screen";
import { DEFAULT_RINGTONE_URL, surfaceShadow } from "../../src/constants/theme";
import { useFakeCallStore } from "../../src/store/fakeCall.store";

export default function FakeCallIncomingScreen() {
  const params = useLocalSearchParams<{ callerName?: string; callerPhone?: string; ringtoneUrl?: string }>();
  const store = useFakeCallStore();
  const callerName = params.callerName || store.callerName;
  const callerPhone = params.callerPhone || store.callerPhone;
  const ringtoneUrl = params.ringtoneUrl || store.ringtoneUrl || DEFAULT_RINGTONE_URL;
  const player = useAudioPlayer(ringtoneUrl, { updateInterval: 1000, downloadFirst: true });

  useEffect(() => {
    player.play();
    Vibration.vibrate([0, 500, 250, 500], true);
    return () => {
      player.pause();
      Vibration.cancel();
    };
  }, [player]);

  return (
    <Screen>
      <View className="flex-1 justify-between py-6">
        <BackPill onPress={() => router.push("/(tabs)/home")} />

        <View className="mt-6 flex-1 items-center justify-center gap-5 rounded-[30px] border border-border bg-panel p-5" style={surfaceShadow}>
          <Text className="text-xl font-semibold uppercase tracking-[1px] text-muted">Incoming call</Text>
          <Text className="text-center text-5xl font-extrabold text-text">{callerName}</Text>
          <Text className="text-lg text-muted">{callerPhone}</Text>

          <View className="mt-4 w-full gap-4">
            <Pressable
              className="h-16 items-center justify-center rounded-full bg-[#1ca96d]"
              onPress={() =>
                router.replace({
                  pathname: "/fake-call/active",
                  params: { callerName, callerPhone, ringtoneUrl },
                })
              }
            >
              <Text className="text-lg font-bold text-white">Answer</Text>
            </Pressable>

            <Pressable
              className="h-16 items-center justify-center rounded-full bg-[#e4473b]"
              onPress={() => {
                useFakeCallStore.getState().clear();
                router.push("/(tabs)/home");
              }}
            >
              <Text className="text-lg font-bold text-white">Decline</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Screen>
  );
}
