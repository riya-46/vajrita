import { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Vibration, Pressable, Text, View } from "react-native";
import { useAudioPlayer } from "expo-audio";
import { Button } from "../../src/components/ui/Button";
import { Screen } from "../../src/components/ui/Screen";
import { DEFAULT_RINGTONE_URL } from "../../src/constants/theme";
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
      <View className="flex-1 items-center justify-between py-12">
        <View className="items-center gap-4 pt-20">
          <Text className="text-2xl font-bold text-text">Incoming call</Text>
          <Text className="text-4xl font-extrabold text-white">{callerName}</Text>
          <Text className="text-base text-muted">{callerPhone}</Text>
        </View>

        <View className="w-full gap-4">
          <Pressable
            className="h-16 items-center justify-center rounded-full bg-emerald-700"
            onPress={() =>
              router.replace({
                pathname: "/fake-call/active",
                params: { callerName, callerPhone, ringtoneUrl },
              })
            }
          >
            <Text className="text-lg font-bold text-white">Answer</Text>
          </Pressable>
          <Button
            variant="danger"
            onPress={() => {
              useFakeCallStore.getState().clear();
              router.back();
            }}
          >
            Decline
          </Button>
        </View>
      </View>
    </Screen>
  );
}
