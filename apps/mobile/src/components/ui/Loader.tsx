import { ActivityIndicator, Text, View } from "react-native";

export function Loader({ label = "Loading..." }: { label?: string }) {
  return (
    <View className="flex-1 items-center justify-center gap-4">
      <ActivityIndicator size="large" color="#ef4444" />
      <Text className="text-base text-muted">{label}</Text>
    </View>
  );
}
