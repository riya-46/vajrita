import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { Button } from "../../src/components/ui/Button";
import { Header } from "../../src/components/ui/Header";
import { Loader } from "../../src/components/ui/Loader";
import { Screen } from "../../src/components/ui/Screen";
import { theme } from "../../src/constants/theme";
import { useContacts } from "../../src/hooks/useContacts";
import { useTracking } from "../../src/hooks/useTracking";
import { useContactsStore } from "../../src/store/contacts.store";
import { formatDateTime } from "../../src/utils/time";

export default function TrackingScreen() {
  const { items, isLoading } = useContacts();
  const { activeQuery, startMutation, stopMutation } = useTracking();
  const selectedIds = useContactsStore((state) => state.selectedIds);
  const toggleSelected = useContactsStore((state) => state.toggleSelected);
  const resetSelected = useContactsStore((state) => state.resetSelected);
  const [duration, setDuration] = useState<"15m" | "1h" | "until_stopped">("15m");

  if (isLoading || activeQuery.isLoading) {
    return <Loader label="Loading live tracking..." />;
  }

  const verifiedContacts = items.filter((contact) => contact.verified);
  const activeSession = activeQuery.data;

  const handleStart = async () => {
    if (!selectedIds.length) {
      Alert.alert("Select contacts", "Choose at least one verified contact to share tracking with.");
      return;
    }

    try {
      await startMutation.mutateAsync({ contactIds: selectedIds, duration });
      resetSelected();
    } catch (error) {
      Alert.alert("Tracking failed", error instanceof Error ? error.message : "Unable to start tracking.");
    }
  };

  return (
    <Screen scrollable header={<Header title="Live Tracking" subtitle="Share your location even before an SOS situation escalates." />}>
      {activeSession?.active ? (
        <View className="gap-4 rounded-3xl border border-accent bg-panel p-5">
          <Text className="text-xl font-bold text-text">Tracking is active</Text>
          <Text className="text-sm text-muted">Share link: {activeSession.shareUrl}</Text>
          <Text className="text-sm text-muted">Last update: {formatDateTime(activeSession.lastLocation?.timestamp)}</Text>
          <Button variant="danger" loading={stopMutation.isPending} onPress={() => stopMutation.mutate(activeSession.id)}>
            Stop Tracking
          </Button>
        </View>
      ) : (
        <View className="gap-4 rounded-3xl bg-panel p-5">
          <Text className="text-xl font-bold text-text">Choose duration</Text>
          <View className="gap-3">
            {theme.emergencyDurations.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => setDuration(option.value)}
                className={`rounded-2xl border p-4 ${duration === option.value ? "border-accent bg-accentMuted" : "border-border bg-panelMuted"}`}
              >
                <Text className="text-base font-bold text-text">{option.label}</Text>
              </Pressable>
            ))}
          </View>
          <Text className="mt-2 text-sm font-semibold uppercase tracking-[1px] text-muted">Recipients</Text>
          <View className="gap-3">
            {verifiedContacts.map((contact) => (
              <Pressable
                key={contact.id}
                onPress={() => toggleSelected(contact.id)}
                className={`rounded-2xl border p-4 ${selectedIds.includes(contact.id) ? "border-accent bg-accentMuted" : "border-border bg-panelMuted"}`}
              >
                <Text className="text-base font-bold text-text">{contact.name}</Text>
                <Text className="text-sm text-muted">{contact.phone}</Text>
              </Pressable>
            ))}
          </View>
          <Button loading={startMutation.isPending} onPress={handleStart}>
            Start Live Tracking
          </Button>
        </View>
      )}
    </Screen>
  );
}
