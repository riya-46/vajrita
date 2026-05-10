import { useEffect, useState } from "react";
import { Vibration, Pressable, Text, View } from "react-native";
import { useAudioPlayer } from "expo-audio";
import { router } from "expo-router";
import { Linking } from "react-native";
import { BackPill, SurfaceCard } from "../../src/components/ui/SoftUI";
import { Screen } from "../../src/components/ui/Screen";
import { DEFAULT_RINGTONE_URL } from "../../src/constants/theme";

export default function VoiceAlertScreen() {
  const player = useAudioPlayer(DEFAULT_RINGTONE_URL, { updateInterval: 1000, downloadFirst: true });
  const [active, setActive] = useState(false);

  useEffect(() => {
    return () => {
      player.pause();
      Vibration.cancel();
    };
  }, [player]);

  const toggleAlert = () => {
    if (active) {
      player.pause();
      Vibration.cancel();
      setActive(false);
      return;
    }

    player.play();
    Vibration.vibrate([0, 600, 250, 600], true);
    setActive(true);
  };

  return (
    <Screen scrollable>
      <View className="gap-5 py-4">
        <BackPill onPress={() => router.push("/(tabs)/home")} />

        <SurfaceCard className="gap-3">
          <Text className="text-[22px] font-extrabold text-text">Voice Alert</Text>
          <Text className="text-lg leading-7 text-muted">
            Trigger a loud attention-grabbing alarm on your phone if you need to attract nearby help immediately.
          </Text>
        </SurfaceCard>

        <SurfaceCard className="items-center gap-5 py-10">
          <View className={`h-44 w-44 items-center justify-center rounded-full ${active ? "bg-[#ffe3df]" : "bg-accentMuted"}`}>
            <Text className={`text-3xl font-extrabold ${active ? "text-[#e4473b]" : "text-accent"}`}>{active ? "ALARM ON" : "READY"}</Text>
          </View>

          <Pressable onPress={toggleAlert} className={`w-full rounded-[24px] px-6 py-5 ${active ? "bg-[#e4473b]" : "bg-accent"}`}>
            <Text className="text-center text-xl font-bold text-white">{active ? "Stop Voice Alert" : "Start Voice Alert"}</Text>
          </Pressable>

          <Pressable
            onPress={() => Linking.openURL("tel:112").catch(() => undefined)}
            className="w-full rounded-[24px] border border-border bg-panel px-6 py-5"
          >
            <Text className="text-center text-xl font-bold text-text">Call Emergency 112</Text>
          </Pressable>
        </SurfaceCard>
      </View>
    </Screen>
  );
}
