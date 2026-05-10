import { router } from "expo-router";
import { Linking, Pressable, Text, View } from "react-native";
import { BackPill, SurfaceCard } from "../../src/components/ui/SoftUI";
import { Screen } from "../../src/components/ui/Screen";

const places = [
  {
    title: "Police Station",
    url: "https://www.google.com/maps/search/?api=1&query=police+station+near+me",
  },
  {
    title: "Hospital",
    url: "https://www.google.com/maps/search/?api=1&query=hospital+near+me",
  },
  {
    title: "Pharmacy",
    url: "https://www.google.com/maps/search/?api=1&query=pharmacy+near+me",
  },
  {
    title: "Metro / Public Transit",
    url: "https://www.google.com/maps/search/?api=1&query=metro+station+near+me",
  },
  {
    title: "Women Help Center",
    url: "https://www.google.com/maps/search/?api=1&query=women+help+center+near+me",
  },
];

export default function SafePlacesScreen() {
  return (
    <Screen scrollable>
      <View className="gap-5 py-4">
        <BackPill onPress={() => router.push("/(tabs)/home")} />

        <SurfaceCard className="gap-3">
          <Text className="text-[22px] font-extrabold text-text">Safe Places</Text>
          <Text className="text-lg leading-7 text-muted">
            Quickly search nearby safe and public locations using Google Maps on the device.
          </Text>
        </SurfaceCard>

        <SurfaceCard className="gap-4">
          {places.map((place) => (
            <View key={place.title} className="flex-row items-center justify-between gap-4 rounded-[22px] bg-panel px-5 py-4">
              <Text className="flex-1 text-lg font-semibold text-text">{place.title}</Text>
              <Pressable
                onPress={() => Linking.openURL(place.url).catch(() => undefined)}
                className="rounded-[18px] bg-accent px-5 py-4"
              >
                <Text className="text-base font-semibold text-white">Open</Text>
              </Pressable>
            </View>
          ))}
        </SurfaceCard>
      </View>
    </Screen>
  );
}
