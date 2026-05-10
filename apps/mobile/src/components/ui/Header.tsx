import { Text, View } from "react-native";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <View className="gap-3 px-5 pb-5 pt-3">
      <Text className="text-4xl font-extrabold text-text">{title}</Text>
      {subtitle ? <Text className="text-lg leading-7 text-muted">{subtitle}</Text> : null}
    </View>
  );
}
