import { router } from "expo-router";
import { Text, View } from "react-native";
import { BackPill, SurfaceCard } from "../../src/components/ui/SoftUI";
import { Button } from "../../src/components/ui/Button";
import { Loader } from "../../src/components/ui/Loader";
import { Screen } from "../../src/components/ui/Screen";
import { useSos } from "../../src/hooks/useSos";
import { formatDateTime } from "../../src/utils/time";

export default function ActiveSosScreen() {
  const { activeQuery, endMutation } = useSos();

  if (activeQuery.isLoading) {
    return <Loader label="Loading active emergency session..." />;
  }

  const session = activeQuery.data;
  if (!session) {
    return (
      <Screen>
        <View className="flex-1 justify-center gap-5">
          <BackPill onPress={() => router.push("/(tabs)/home")} />
          <Text className="text-center text-muted">You can return to Home to trigger SOS again.</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scrollable>
      <View className="gap-5 py-4">
        <BackPill onPress={() => router.push("/(tabs)/home")} />

        <SurfaceCard className="gap-3">
          <Text className="text-[22px] font-extrabold text-text">Emergency Session</Text>
          <Text className="text-lg leading-7 text-muted">Keep this running until you are safe.</Text>
        </SurfaceCard>

        <SurfaceCard className="gap-4 border-[#f0c7cc] bg-[#fff6f7]">
          <Text className="text-xl font-bold text-[#8f2432]">Alerts sent</Text>
          <Text className="text-base leading-7 text-[#aa5a68]">Started: {formatDateTime(session.startedAt)}</Text>
          <Text className="text-base leading-7 text-[#aa5a68]">
            Recipients: {session.recipients.map((item) => item.name).join(", ")}
          </Text>
          <Text className="text-base leading-7 text-[#aa5a68]">Channels: {session.channels.join(", ")}</Text>
          <Text className="text-base leading-7 text-[#aa5a68]">
            Summary: {session.alertSummary.sent} sent, {session.alertSummary.failed} failed, {session.alertSummary.pending} pending
          </Text>
          {session.trackingSession ? (
            <Text className="text-base leading-7 text-[#aa5a68]">Live link: {session.trackingSession.shareUrl}</Text>
          ) : null}
        </SurfaceCard>

        <Button variant="danger" loading={endMutation.isPending} onPress={() => endMutation.mutate(session.id)}>
          End Emergency Session
        </Button>
      </View>
    </Screen>
  );
}
