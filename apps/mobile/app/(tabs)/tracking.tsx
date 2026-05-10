import { router } from "expo-router";
import { Alert, Pressable, Text, View } from "react-native";
import { BackPill, ContactChip, SurfaceCard } from "../../src/components/ui/SoftUI";
import { Button } from "../../src/components/ui/Button";
import { ErrorState } from "../../src/components/ui/ErrorState";
import { Loader } from "../../src/components/ui/Loader";
import { Screen } from "../../src/components/ui/Screen";
import { surfaceShadow, theme } from "../../src/constants/theme";
import { useContacts } from "../../src/hooks/useContacts";
import { useTracking } from "../../src/hooks/useTracking";
import { formatDateTime } from "../../src/utils/time";

export default function TrackingScreen() {
  const { items, isLoading } = useContacts();
  const { activeQuery, startMutation, stopMutation } = useTracking();

  if (isLoading || activeQuery.isLoading) {
    return <Loader label="Loading live tracking..." />;
  }

  const verifiedContacts = items.filter((contact) => contact.verified && !contact.isDefault);
  const activeSession = activeQuery.data;

  const handleSend = async (contactId: string, duration: "15m" | "1h" | "until_stopped") => {
    try {
      await startMutation.mutateAsync({ contactIds: [contactId], duration });
    } catch (error) {
      Alert.alert("Tracking failed", error instanceof Error ? error.message : "Unable to start live tracking.");
    }
  };

  return (
    <Screen scrollable>
      <View className="gap-5 py-4">
        <BackPill onPress={() => router.push("/(tabs)/home")} />

        <SurfaceCard className="gap-3">
          <Text className="text-[22px] font-extrabold text-text">Live Tracking</Text>
          <Text className="text-lg leading-7 text-muted">
            Share live location and provide updates directly to your trusted contacts.
          </Text>
        </SurfaceCard>

        {activeSession?.active ? (
          <SurfaceCard className="gap-4">
            <Text className="text-xl font-bold text-text">Tracking is active</Text>
            <Text className="text-base leading-7 text-muted">Share link: {activeSession.shareUrl}</Text>
            <Text className="text-base leading-7 text-muted">
              Last update: {formatDateTime(activeSession.lastLocation?.timestamp)}
            </Text>
            <Button variant="danger" loading={stopMutation.isPending} onPress={() => stopMutation.mutate(activeSession.id)}>
              Stop Tracking
            </Button>
          </SurfaceCard>
        ) : (
          <SurfaceCard className="gap-5">
            <View className="gap-3">
              <Text className="text-base font-semibold uppercase tracking-[1px] text-muted">Tracking duration</Text>
              <View className="flex-row flex-wrap gap-3">
                {theme.emergencyDurations.map((option) => (
                  <View key={option.value} className="rounded-full bg-accentMuted px-4 py-3">
                    <Text className="font-semibold text-accent">{option.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <SurfaceCard className="gap-4 p-4">
              {verifiedContacts.length ? (
                verifiedContacts.map((contact) => (
                  <View
                    key={contact.id}
                    className="flex-row items-center justify-between gap-4 rounded-[24px] border border-border bg-panel px-4 py-5"
                    style={surfaceShadow}
                  >
                    <View className="flex-1">
                      <ContactChip label={contact.name} />
                    </View>
                    <Pressable
                      onPress={() => handleSend(contact.id, "until_stopped")}
                      className="rounded-[18px] bg-accent px-6 py-4"
                      style={surfaceShadow}
                    >
                      <Text className="text-lg font-semibold text-white">Send</Text>
                    </Pressable>
                  </View>
                ))
              ) : (
                <ErrorState
                  title="No verified contacts"
                  message="Verify at least one trusted contact before using live location sharing."
                />
              )}
            </SurfaceCard>
          </SurfaceCard>
        )}
      </View>
    </Screen>
  );
}
