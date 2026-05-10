import { router } from "expo-router";
import type { PropsWithChildren } from "react";
import { Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { surfaceShadow } from "../../constants/theme";

export function SurfaceCard({
  children,
  className = "",
  style,
}: PropsWithChildren<{ className?: string; style?: StyleProp<ViewStyle> }>) {
  return (
    <View className={`rounded-[30px] border border-border bg-panel p-5 ${className}`} style={[surfaceShadow, style]}>
      {children}
    </View>
  );
}

export function BackPill({ onPress, label = "Back" }: { onPress?: () => void; label?: string }) {
  return (
    <Pressable
      onPress={onPress ?? (() => router.push("/(tabs)/home"))}
      className="self-start rounded-[20px] border border-border bg-panel px-5 py-3"
      style={surfaceShadow}
    >
      <Text className="text-lg font-semibold text-text">{label}</Text>
    </Pressable>
  );
}

export function HeroBadge({ label }: { label: string }) {
  return (
    <View className="self-center rounded-full border border-border bg-panel px-5 py-2" style={surfaceShadow}>
      <Text className="text-sm font-bold uppercase tracking-[2px] text-accent">{label}</Text>
    </View>
  );
}

export function AccentDivider() {
  return <View className="h-1 w-28 self-center rounded-full bg-accent" />;
}

export function ContactChip({ label }: { label: string }) {
  return (
    <View className="rounded-full bg-accentMuted px-5 py-3">
      <Text className="text-xl font-bold text-accent">{label}</Text>
    </View>
  );
}
