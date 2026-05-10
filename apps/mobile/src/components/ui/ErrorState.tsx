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
    <View className="rounded-3xl border border-[#f0c7cc] bg-[#fff4f5] p-5">
      <Text className="text-lg font-bold text-[#8f2432]">{title}</Text>
      <Text className="mt-2 text-sm leading-6 text-[#aa5a68]">{message}</Text>
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
