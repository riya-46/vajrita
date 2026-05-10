import type { PropsWithChildren, ReactNode } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

interface ScreenProps extends PropsWithChildren {
  scrollable?: boolean;
  header?: ReactNode;
}

export function Screen({ children, scrollable = false, header }: ScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      {header}
      {scrollable ? (
        <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40, gap: 16 }}>
          {children}
        </ScrollView>
      ) : (
        <View className="flex-1 px-5">{children}</View>
      )}
    </SafeAreaView>
  );
}
