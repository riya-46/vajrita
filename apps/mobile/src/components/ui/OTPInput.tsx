import { useRef } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { OTP_LENGTH } from "@vajrita/shared";

interface OTPInputProps {
  value: string;
  onChangeText: (value: string) => void;
  error?: string | null;
}

export function OTPInput({ value, onChangeText, error }: OTPInputProps) {
  const inputRef = useRef<TextInput>(null);
  const digits = Array.from({ length: OTP_LENGTH }).map((_, index) => value[index] || "");

  return (
    <View className="gap-4">
      <TextInput
        ref={inputRef}
        keyboardType="number-pad"
        maxLength={OTP_LENGTH}
        value={value}
        onChangeText={(text) => onChangeText(text.replace(/[^\d]/g, ""))}
        className="absolute opacity-0"
      />
      <Pressable className="flex-row justify-between gap-2" onPress={() => inputRef.current?.focus()}>
        {digits.map((digit, index) => (
          <View key={index} className="h-14 flex-1 items-center justify-center rounded-2xl border border-border bg-panel">
            <Text className="text-2xl font-bold text-text">{digit || "•"}</Text>
          </View>
        ))}
      </Pressable>
      {error ? <Text className="text-sm text-red-400">{error}</Text> : null}
    </View>
  );
}
