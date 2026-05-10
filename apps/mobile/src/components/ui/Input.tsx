import type { TextInputProps } from "react-native";
import { Text, TextInput, View } from "react-native";

interface InputProps extends TextInputProps {
  label: string;
  error?: string | null;
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold text-text">{label}</Text>
      <TextInput
        placeholderTextColor="#64748b"
        className="h-14 rounded-2xl border border-border bg-panel px-4 text-base text-text"
        {...props}
      />
      {error ? <Text className="text-sm text-red-400">{error}</Text> : null}
    </View>
  );
}
