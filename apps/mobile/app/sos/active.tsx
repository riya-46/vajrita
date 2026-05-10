import { Text, View } from "react-native";
import { Button } from "../../src/components/ui/Button";
import { Header } from "../../src/components/ui/Header";
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
      <Screen header={<Header title="No active SOS" subtitle="Emergency alerts are currently inactive." />}>
        <View className="flex-1 justify-center">
          <Text className="text-center text-muted">You can return to Home to trigger SOS again.</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scrollable header={<Header title="Emergency Session" subtitle="Keep this running until you are safe." />}>
      <View className="gap-4 rounded-3xl border border-red-800 bg-red-950/40 p-5">
        <Text className="text-lg font-bold text-white">Alerts sent</Text>
        <Text className="text-sm text-red-100">Started: {formatDateTime(session.startedAt)}</Text>
        <Text className="text-sm text-red-100">Recipients: {session.recipients.map((item) => item.name).join(", ")}</Text>
        <Text className="text-sm text-red-100">Channels: {session.channels.join(", ")}</Text>
        <Text className="text-sm text-red-100">
          Summary: {session.alertSummary.sent} sent, {session.alertSummary.failed} failed, {session.alertSummary.pending} pending
        </Text>
        {session.trackingSession ? (
          <Text className="text-sm text-red-100">Live link: {session.trackingSession.shareUrl}</Text>
        ) : null}
      </View>
      <Button variant="danger" loading={endMutation.isPending} onPress={() => endMutation.mutate(session.id)}>
        End Emergency Session
      </Button>
    </Screen>
  );
}
