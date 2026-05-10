import { router } from "expo-router";
import { Linking, Pressable, Text, View } from "react-native";
import { BackPill, SurfaceCard } from "../../src/components/ui/SoftUI";
import { Screen } from "../../src/components/ui/Screen";

const actions = [
  {
    title: "Women Police Station",
    description: "Search nearby women police stations in Google Maps.",
    url: "https://www.google.com/maps/search/?api=1&query=women+police+station+near+me",
  },
  {
    title: "Police Station",
    description: "Open nearby police stations.",
    url: "https://www.google.com/maps/search/?api=1&query=police+station+near+me",
  },
  {
    title: "Hospital",
    description: "Open nearby hospitals for urgent medical help.",
    url: "https://www.google.com/maps/search/?api=1&query=hospital+near+me",
  },
];

export default function RiskZonesScreen() {
  return (
    <Screen scrollable>
      <View className="gap-5 py-4">
        <BackPill onPress={() => router.push("/(tabs)/home")} />

        <SurfaceCard className="gap-3">
          <Text className="text-[22px] font-extrabold text-text">Risk Zones & Support</Text>
          <Text className="text-lg leading-7 text-muted">
            Use these quick actions to find nearby support points when you feel unsafe. This is a practical emergency lookup,
            not a live crime heatmap.
          </Text>
        </SurfaceCard>

        {actions.map((action) => (
          <SurfaceCard key={action.title} className="gap-4">
            <Text className="text-xl font-bold text-text">{action.title}</Text>
            <Text className="text-base leading-7 text-muted">{action.description}</Text>
            <Pressable
              onPress={() => Linking.openURL(action.url).catch(() => undefined)}
              className="self-start rounded-[18px] bg-accent px-5 py-4"
            >
              <Text className="text-lg font-semibold text-white">Open Search</Text>
            </Pressable>
          </SurfaceCard>
        ))}
      </View>
    </Screen>
  );
}
