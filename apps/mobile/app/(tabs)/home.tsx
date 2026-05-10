import { router } from "expo-router";
import { Alert, Pressable, Text, View } from "react-native";
import { Loader } from "../../src/components/ui/Loader";
import { AccentDivider, HeroBadge, SurfaceCard } from "../../src/components/ui/SoftUI";
import { Screen } from "../../src/components/ui/Screen";
import { surfaceShadow } from "../../src/constants/theme";
import { useSos } from "../../src/hooks/useSos";

function MenuButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="self-center rounded-[24px] border border-border bg-panel px-9 py-5"
      style={[surfaceShadow, { minWidth: 252 }]}
    >
      <Text className="text-center text-[18px] font-bold text-text">{label}</Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const { activeQuery } = useSos();

  if (activeQuery.isLoading) {
    return <Loader label="Preparing Vajrita..." />;
  }

  const activeSession = activeQuery.data;

  return (
    <Screen scrollable>
      <View className="flex-1 justify-center gap-8 py-8">
        <HeroBadge label="VAJRITA" />
        <View className="gap-4">
          <Text
            className="text-center text-[28px] font-bold leading-[42px] text-text"
            style={{ fontFamily: "serif" }}
          >
            Powerful Women Safety App
          </Text>
          <AccentDivider />
        </View>

        {activeSession?.active ? (
          <SurfaceCard className="gap-2">
            <Text className="text-lg font-bold text-text">Emergency session is active</Text>
            <Text className="text-base leading-7 text-muted">
              A live SOS session is already running. Open it to manage alerts and tracking.
            </Text>
            <Pressable onPress={() => router.push("/sos/active")} className="mt-2 self-start rounded-full bg-accent px-5 py-3">
              <Text className="font-semibold text-white">Open Active SOS</Text>
            </Pressable>
          </SurfaceCard>
        ) : null}

        <View className="gap-5">
          <MenuButton label="Send SOS Alert" onPress={() => router.push("/sos")} />
          <MenuButton label="Emergency Contacts" onPress={() => router.push("/(tabs)/contacts")} />
          <MenuButton label="Share Live Location" onPress={() => router.push("/(tabs)/tracking")} />
          <MenuButton
            label="Voice Alert"
            onPress={() => Alert.alert("Coming soon", "Voice alert can be added once on-device audio recording is wired.")}
          />
          <MenuButton
            label="Risk Zones"
            onPress={() => Alert.alert("Coming soon", "Risk zone mapping will need maps and location-intelligence integration.")}
          />
          <MenuButton label="Fake Call" onPress={() => router.push("/fake-call/setup")} />
          <MenuButton
            label="Safe Places"
            onPress={() => Alert.alert("Coming soon", "Safe places can be added once map search is connected.")}
          />
        </View>
      </View>
    </Screen>
  );
}
