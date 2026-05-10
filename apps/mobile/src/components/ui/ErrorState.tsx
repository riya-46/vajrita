import { Text, View } from "react-native";
import { Button } from "./Button";

interface ErrorStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function ErrorState({ title, message, actionLabel, onAction }: ErrorStateProps) {
  return (
    <View className="rounded-3xl border border-red-800 bg-red-950/30 p-5">
      <Text className="text-lg font-bold text-white">{title}</Text>
      <Text className="mt-2 text-sm text-red-200">{message}</Text>
      {actionLabel && onAction ? (
        <View className="mt-4">
          <Button variant="danger" onPress={onAction}>
            {actionLabel}
          </Button>
        </View>
      ) : null}
    </View>
  );
}
