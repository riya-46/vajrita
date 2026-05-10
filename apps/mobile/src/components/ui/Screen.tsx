import type { PropsWithChildren, ReactNode } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

interface ScreenProps extends PropsWithChildren {
  scrollable?: boolean;
  header?: ReactNode;
}

export function Screen({ children, scrollable = false, header }: ScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View pointerEvents="none" className="absolute -left-24 top-6 h-72 w-72 rounded-full bg-[#ffe6cf]" style={{ opacity: 0.65 }} />
      <View pointerEvents="none" className="absolute -right-28 bottom-8 h-80 w-80 rounded-full bg-[#dfe8ff]" style={{ opacity: 0.75 }} />
      <View pointerEvents="none" className="absolute inset-0 bg-white/40" />
      {header}
      {scrollable ? (
        <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40, gap: 18 }}>
          {children}
        </ScrollView>
      ) : (
        <View className="flex-1 px-5">{children}</View>
      )}
    </SafeAreaView>
  );
}
