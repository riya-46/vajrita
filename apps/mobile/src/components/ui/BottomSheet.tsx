import type { PropsWithChildren } from "react";
import { Modal, Pressable, Text, View } from "react-native";

interface BottomSheetProps extends PropsWithChildren {
  visible: boolean;
  title: string;
  onClose: () => void;
}

export function BottomSheet({ visible, title, onClose, children }: BottomSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/60" onPress={onClose}>
        <Pressable className="mt-auto rounded-t-3xl bg-panel px-5 pb-8 pt-4" onPress={() => undefined}>
          <View className="mb-4 h-1.5 w-12 self-center rounded-full bg-border" />
          <Text className="mb-4 text-xl font-bold text-text">{title}</Text>
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
