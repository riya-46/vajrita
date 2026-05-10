import { Link, router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Linking, Pressable, Text, View } from "react-native";
import { Button } from "../../src/components/ui/Button";
import { BottomSheet } from "../../src/components/ui/BottomSheet";
import { ErrorState } from "../../src/components/ui/ErrorState";
import { Header } from "../../src/components/ui/Header";
import { Loader } from "../../src/components/ui/Loader";
import { Screen } from "../../src/components/ui/Screen";
import { useContacts } from "../../src/hooks/useContacts";
import { useFakeCall } from "../../src/hooks/useFakeCall";
import { useSos } from "../../src/hooks/useSos";
import { scheduleFakeCall } from "../../src/services/fake-call";
import { useContactsStore } from "../../src/store/contacts.store";
import { useEmergencyStore } from "../../src/store/emergency.store";

export default function HomeScreen() {
  const { items, isLoading } = useContacts();
  const { activeQuery, startMutation } = useSos();
  const { configQuery } = useFakeCall();
  const selectedIds = useContactsStore((state) => state.selectedIds);
  const toggleSelected = useContactsStore((state) => state.toggleSelected);
  const resetSelected = useContactsStore((state) => state.resetSelected);
  const selectedChannels = useEmergencyStore((state) => state.selectedChannels);
  const toggleChannel = useEmergencyStore((state) => state.toggleChannel);
  const activeSession = activeQuery.data;
  const verifiedContacts = useMemo(() => items.filter((contact) => contact.verified), [items]);
  const selectedContacts = verifiedContacts.filter((contact) => selectedIds.includes(contact.id));
  const [sosSheetOpen, setSosSheetOpen] = useState(false);
  const [fakeCallOpen, setFakeCallOpen] = useState(false);
  const [fakeDelay, setFakeDelay] = useState(20);

  if (isLoading || activeQuery.isLoading) {
    return <Loader label="Preparing emergency dashboard..." />;
  }

  const handleSendSos = async () => {
    if (!selectedIds.length || !selectedChannels.length) {
      Alert.alert("Select contacts and channels", "Choose at least one trusted contact and one alert channel.");
      return;
    }

    try {
      const session = await startMutation.mutateAsync({
        contactIds: selectedIds,
        channels: selectedChannels,
        trackingDuration: "until_stopped",
      });

      setSosSheetOpen(false);
      if (selectedChannels.includes("call")) {
        const firstContact = selectedContacts[0];
        if (firstContact) {
          Linking.openURL(`tel:${firstContact.phone}`).catch(() => undefined);
        }
      }

      router.push("/sos/active");
      resetSelected();
      return session;
    } catch (error) {
      Alert.alert("SOS failed", error instanceof Error ? error.message : "Emergency session could not start.");
    }
  };

  const handleFakeCall = async () => {
    const caller = selectedContacts[0] || verifiedContacts[0];
    if (!caller) {
      Alert.alert("No verified contact", "Verify at least one trusted contact before scheduling a fake call.");
      return;
    }

    await scheduleFakeCall({
      callerName: caller.name,
      callerPhone: caller.phone,
      ringtoneUrl: configQuery.data?.ringtoneUrl,
      delaySeconds: fakeDelay,
    });
    setFakeCallOpen(false);
    Alert.alert("Fake call armed", `Incoming call will appear in ${fakeDelay} seconds.`);
  };

  return (
    <Screen scrollable header={<Header title="Emergency Home" subtitle="Large targets, fast actions, low friction." />}>
      {activeSession?.active ? (
        <Link href="/sos/active" asChild>
          <Pressable className="rounded-3xl border border-red-800 bg-red-950/40 p-5">
            <Text className="text-lg font-bold text-white">Emergency session active</Text>
            <Text className="mt-2 text-sm text-red-200">Tap to manage live alerts and tracking.</Text>
          </Pressable>
        </Link>
      ) : null}

      <Pressable
        onPress={() => setSosSheetOpen(true)}
        className="h-64 items-center justify-center rounded-[36px] border border-red-800 bg-accent"
      >
        <Text className="text-emergency text-white">SOS</Text>
        <Text className="mt-3 text-base font-semibold text-white">Tap to alert trusted contacts now</Text>
      </Pressable>

      <View className="flex-row gap-3">
        <Pressable className="flex-1 rounded-3xl bg-panel p-4" onPress={() => setFakeCallOpen(true)}>
          <Text className="text-lg font-bold text-text">Fake Call</Text>
          <Text className="mt-2 text-sm text-muted">Trigger an escape call on a delay.</Text>
        </Pressable>
        <Link href="/(tabs)/tracking" asChild>
          <Pressable className="flex-1 rounded-3xl bg-panel p-4">
            <Text className="text-lg font-bold text-text">Live Tracking</Text>
            <Text className="mt-2 text-sm text-muted">Share location outside SOS.</Text>
          </Pressable>
        </Link>
      </View>

      <View className="rounded-3xl bg-panel p-5">
        <Text className="text-lg font-bold text-text">Verified contacts ready</Text>
        <Text className="mt-1 text-sm text-muted">
          {verifiedContacts.length} verified contact{verifiedContacts.length === 1 ? "" : "s"} available for emergency actions.
        </Text>
      </View>

      {!verifiedContacts.length ? (
        <ErrorState
          title="No verified contacts yet"
          message="Add and verify trusted contacts before relying on SOS or fake call."
        />
      ) : null}

      <BottomSheet visible={sosSheetOpen} title="Start SOS" onClose={() => setSosSheetOpen(false)}>
        <View className="gap-5">
          <View className="gap-3">
            <Text className="text-sm font-semibold uppercase tracking-[1px] text-muted">Select trusted contacts</Text>
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

          <View className="gap-3">
            <Text className="text-sm font-semibold uppercase tracking-[1px] text-muted">Alert channels</Text>
            {(["sms", "whatsapp", "call"] as const).map((channel) => (
              <Pressable
                key={channel}
                onPress={() => toggleChannel(channel)}
                className={`rounded-2xl border p-4 ${selectedChannels.includes(channel) ? "border-accent bg-accentMuted" : "border-border bg-panelMuted"}`}
              >
                <Text className="text-base font-bold capitalize text-text">{channel}</Text>
              </Pressable>
            ))}
          </View>

          <Button loading={startMutation.isPending} onPress={handleSendSos}>
            Send SOS
          </Button>
        </View>
      </BottomSheet>

      <BottomSheet visible={fakeCallOpen} title="Schedule Fake Call" onClose={() => setFakeCallOpen(false)}>
        <View className="gap-5">
          <View className="gap-3">
            {[10, 20, 60].map((delay) => (
              <Pressable
                key={delay}
                onPress={() => setFakeDelay(delay)}
                className={`rounded-2xl border p-4 ${fakeDelay === delay ? "border-accent bg-accentMuted" : "border-border bg-panelMuted"}`}
              >
                <Text className="text-base font-bold text-text">In {delay} seconds</Text>
              </Pressable>
            ))}
          </View>
          <Button onPress={handleFakeCall}>Arm Fake Call</Button>
        </View>
      </BottomSheet>
    </Screen>
  );
}
