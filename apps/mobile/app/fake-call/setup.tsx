import { router } from "expo-router";
import { Alert, Pressable, Text, View } from "react-native";
import { BackPill, ContactChip, SurfaceCard } from "../../src/components/ui/SoftUI";
import { ErrorState } from "../../src/components/ui/ErrorState";
import { Loader } from "../../src/components/ui/Loader";
import { Screen } from "../../src/components/ui/Screen";
import { surfaceShadow } from "../../src/constants/theme";
import { useContacts } from "../../src/hooks/useContacts";
import { useFakeCall } from "../../src/hooks/useFakeCall";
import { scheduleFakeCall } from "../../src/services/fake-call";

export default function FakeCallSetupScreen() {
  const { items, isLoading } = useContacts();
  const { configQuery } = useFakeCall();

  if (isLoading || configQuery.isLoading) {
    return <Loader label="Loading fake call setup..." />;
  }

  const trustedContacts = items.filter((contact) => contact.verified && !contact.isDefault);
  const defaultDelay = configQuery.data?.defaultDelaySeconds || 20;

  const handleSchedule = async (callerName: string, callerPhone: string) => {
    try {
      await scheduleFakeCall({
        callerName,
        callerPhone,
        ringtoneUrl: configQuery.data?.ringtoneUrl,
        delaySeconds: defaultDelay,
      });
      Alert.alert("Fake call armed", `An incoming call will appear in ${defaultDelay} seconds.`);
    } catch (error) {
      Alert.alert("Fake call failed", error instanceof Error ? error.message : "Could not schedule the fake call.");
    }
  };

  return (
    <Screen scrollable>
      <View className="gap-5 py-4">
        <BackPill onPress={() => router.push("/(tabs)/home")} />

        <SurfaceCard className="gap-3">
          <Text className="text-[22px] font-extrabold text-text">Fake Call</Text>
          <Text className="text-lg leading-7 text-muted">
            Pick a trusted contact identity and trigger a convincing incoming call using your saved delay and ringtone.
          </Text>
        </SurfaceCard>

        <SurfaceCard className="gap-4">
          <SurfaceCard className="gap-4 p-4">
            {trustedContacts.length ? (
              trustedContacts.map((contact) => (
                <View
                  key={contact.id}
                  className="flex-row items-center justify-between gap-4 rounded-[24px] border border-border bg-panel px-4 py-5"
                  style={surfaceShadow}
                >
                  <View className="flex-1">
                    <ContactChip label={contact.name} />
                  </View>
                  <Pressable
                    onPress={() => handleSchedule(contact.name, contact.phone)}
                    className="rounded-[18px] bg-accent px-5 py-4"
                    style={surfaceShadow}
                  >
                    <Text className="text-lg font-semibold text-white">Get Call</Text>
                  </Pressable>
                </View>
              ))
            ) : (
              <ErrorState
                title="No verified contacts"
                message="Verify at least one trusted contact before using the fake call feature."
              />
            )}
          </SurfaceCard>
        </SurfaceCard>
      </View>
    </Screen>
  );
}
