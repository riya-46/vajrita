import { router } from "expo-router";
import { useState } from "react";
import { Alert, View } from "react-native";
import { Button } from "../../src/components/ui/Button";
import { Header } from "../../src/components/ui/Header";
import { Input } from "../../src/components/ui/Input";
import { Screen } from "../../src/components/ui/Screen";
import { useContacts } from "../../src/hooks/useContacts";
import { normalizePhoneNumber } from "../../src/utils/phone";

export default function NewContactScreen() {
  const { createMutation } = useContacts();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] = useState("");

  const handleSave = async () => {
    try {
      await createMutation.mutateAsync({
        name: name.trim(),
        phone: normalizePhoneNumber(phone),
        relationship: relationship.trim(),
      });
      router.back();
    } catch (error) {
      Alert.alert("Save failed", error instanceof Error ? error.message : "Unable to save contact.");
    }
  };

  return (
    <Screen scrollable header={<Header title="Add Trusted Contact" subtitle="This person can receive your SOS and live tracking alerts." />}>
      <View className="gap-4">
        <Input label="Name" value={name} onChangeText={setName} />
        <Input label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Input label="Relationship" value={relationship} onChangeText={setRelationship} />
        <Button loading={createMutation.isPending} onPress={handleSave}>
          Save Contact
        </Button>
      </View>
    </Screen>
  );
}
