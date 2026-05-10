import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { Button } from "../../src/components/ui/Button";
import { Header } from "../../src/components/ui/Header";
import { Input } from "../../src/components/ui/Input";
import { Loader } from "../../src/components/ui/Loader";
import { Screen } from "../../src/components/ui/Screen";
import { useFakeCall } from "../../src/hooks/useFakeCall";
import { logOut } from "../../src/services/auth";
import { useAuthStore } from "../../src/store/auth.store";

export default function SettingsScreen() {
  const user = useAuthStore((state) => state.user);
  const { configQuery, updateMutation } = useFakeCall();
  const [callerName, setCallerName] = useState("");
  const [callerPhone, setCallerPhone] = useState("");
  const [ringtoneUrl, setRingtoneUrl] = useState("");
  const [delay, setDelay] = useState("20");

  useEffect(() => {
    if (configQuery.data) {
      setCallerName(configQuery.data.defaultCallerName);
      setCallerPhone(configQuery.data.defaultCallerPhone);
      setRingtoneUrl(configQuery.data.ringtoneUrl || "");
      setDelay(String(configQuery.data.defaultDelaySeconds));
    }
  }, [configQuery.data]);

  if (configQuery.isLoading) {
    return <Loader label="Loading settings..." />;
  }

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        defaultCallerName: callerName,
        defaultCallerPhone: callerPhone,
        ringtoneUrl: ringtoneUrl || undefined,
        defaultDelaySeconds: Number(delay) || 20,
      });
      Alert.alert("Saved", "Fake call defaults updated.");
    } catch (error) {
      Alert.alert("Save failed", error instanceof Error ? error.message : "Could not update settings.");
    }
  };

  return (
    <Screen scrollable header={<Header title="Settings" subtitle="Review your profile and tune fake-call defaults." />}>
      <View className="rounded-3xl bg-panel p-5">
        <Text className="text-lg font-bold text-text">{user?.name || "Signed in user"}</Text>
        <Text className="mt-1 text-sm text-muted">{user?.phone}</Text>
      </View>

      <View className="gap-4 rounded-3xl bg-panel p-5">
        <Text className="text-lg font-bold text-text">Fake Call Defaults</Text>
        <Input label="Caller name" value={callerName} onChangeText={setCallerName} />
        <Input label="Caller phone" value={callerPhone} onChangeText={setCallerPhone} />
        <Input label="Delay seconds" value={delay} onChangeText={setDelay} keyboardType="number-pad" />
        <Input label="Ringtone URL" value={ringtoneUrl} onChangeText={setRingtoneUrl} placeholder="Optional remote audio URL" />
        <Button loading={updateMutation.isPending} onPress={handleSave}>
          Save Defaults
        </Button>
      </View>

      <Button
        variant="ghost"
        onPress={async () => {
          await logOut();
          router.replace("/(auth)/phone");
        }}
      >
        Sign Out
      </Button>
    </Screen>
  );
}
