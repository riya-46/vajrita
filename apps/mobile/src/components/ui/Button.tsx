import type { PropsWithChildren } from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";

interface ButtonProps extends PropsWithChildren {
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

const variants = {
  primary: "bg-accent",
  secondary: "bg-panelMuted",
  danger: "bg-red-700",
  ghost: "bg-transparent border border-border",
};

export function Button({
  children,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
}: ButtonProps) {
  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      className={`h-14 items-center justify-center rounded-2xl px-5 ${variants[variant]} ${
        disabled ? "opacity-50" : ""
      }`}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text className="text-base font-bold text-white">{children}</Text>
      )}
    </Pressable>
  );
}
