import { router } from "expo-router";
import { Alert, Linking, Pressable, Text, View } from "react-native";
import { BackPill, ContactChip, SurfaceCard } from "../../src/components/ui/SoftUI";
import { ErrorState } from "../../src/components/ui/ErrorState";
import { Loader } from "../../src/components/ui/Loader";
import { Screen } from "../../src/components/ui/Screen";
import { surfaceShadow } from "../../src/constants/theme";
import { useContacts } from "../../src/hooks/useContacts";
import { useSos } from "../../src/hooks/useSos";
import { useEmergencyStore } from "../../src/store/emergency.store";

export default function SosSetupScreen() {
  const { items, isLoading } = useContacts();
  const { activeQuery, startMutation } = useSos();
  const selectedChannels = useEmergencyStore((state) => state.selectedChannels);
  const toggleChannel = useEmergencyStore((state) => state.toggleChannel);

  if (isLoading || activeQuery.isLoading) {
    return <Loader label="Loading SOS options..." />;
  }

  const trustedContacts = items.filter((contact) => contact.verified && !contact.isDefault);
  const emergencyNumbers = items.filter((contact) => contact.isDefault);

  const handleSend = async (contactId: string) => {
    if (!selectedChannels.length) {
      Alert.alert("Select a channel", "Pick at least one alert channel before sending SOS.");
      return;
    }

    try {
      await startMutation.mutateAsync({
        contactIds: [contactId],
        channels: selectedChannels,
        trackingDuration: "until_stopped",
      });
      router.push("/sos/active");
    } catch (error) {
      Alert.alert("SOS failed", error instanceof Error ? error.message : "Unable to start emergency alert.");
    }
  };

  return (
    <Screen scrollable>
      <View className="gap-5 py-4">
        <BackPill onPress={() => router.push("/(tabs)/home")} />

        <SurfaceCard className="gap-3">
          <Text className="text-[22px] font-extrabold text-text">SOS Alert</Text>
          <Text className="text-lg leading-7 text-muted">
            Send alert messages and live location to your emergency contacts in one tap.
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {(["sms", "whatsapp", "call"] as const).map((channel) => (
              <Pressable
                key={channel}
                onPress={() => toggleChannel(channel)}
                className={`rounded-full px-4 py-3 ${selectedChannels.includes(channel) ? "bg-accent" : "bg-accentMuted"}`}
              >
                <Text className={`font-semibold capitalize ${selectedChannels.includes(channel) ? "text-white" : "text-accent"}`}>
                  {channel}
                </Text>
              </Pressable>
            ))}
          </View>
        </SurfaceCard>

        {activeQuery.data?.active ? (
          <SurfaceCard className="gap-3">
            <Text className="text-lg font-bold text-text">An SOS session is already active</Text>
            <Pressable onPress={() => router.push("/sos/active")} className="self-start rounded-full bg-accent px-5 py-3">
              <Text className="font-semibold text-white">Open Active Session</Text>
            </Pressable>
          </SurfaceCard>
        ) : null}

        <SurfaceCard className="gap-4">
          <SurfaceCard className="gap-4 p-4">
            {trustedContacts.length ? (
              trustedContacts.map((contact) => (
                <View
                  key={contact.id}
                  className="flex-row items-center justify-between gap-3 rounded-[24px] border border-border bg-panel px-4 py-5"
                  style={surfaceShadow}
                >
                  <View className="flex-1">
                    <ContactChip label={contact.name} />
                  </View>
                  <Pressable
                    onPress={() => handleSend(contact.id)}
                    className="rounded-[18px] bg-accent px-5 py-4"
                    style={surfaceShadow}
                  >
                    <Text className="text-lg font-semibold text-white">Send</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => Linking.openURL(`tel:${contact.phone}`).catch(() => undefined)}
                    className="rounded-[18px] border border-border bg-panel px-5 py-4"
                  >
                    <Text className="text-lg font-semibold text-text">Call</Text>
                  </Pressable>
                </View>
              ))
            ) : (
              <ErrorState
                title="No verified contacts ready"
                message="Verify at least one trusted contact before sending an SOS alert."
              />
            )}
          </SurfaceCard>

          <SurfaceCard className="gap-4">
            {emergencyNumbers.map((contact) => (
              <View key={contact.id} className="flex-row items-center justify-between gap-4 rounded-[20px] bg-panel px-4 py-3">
                <Text className="flex-1 text-xl text-text">{contact.name}</Text>
                <Pressable
                  onPress={() => Linking.openURL(`tel:${contact.phone}`).catch(() => undefined)}
                  className="rounded-[18px] bg-[#e4473b] px-5 py-4"
                >
                  <Text className="text-lg font-semibold text-white">Call</Text>
                </Pressable>
              </View>
            ))}
          </SurfaceCard>
        </SurfaceCard>
      </View>
    </Screen>
  );
}
