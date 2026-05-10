import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, Linking, View } from "react-native";
import { Button } from "../../src/components/ui/Button";
import { Header } from "../../src/components/ui/Header";
import { Input } from "../../src/components/ui/Input";
import { Loader } from "../../src/components/ui/Loader";
import { Screen } from "../../src/components/ui/Screen";
import { useContacts } from "../../src/hooks/useContacts";
import { normalizePhoneNumber } from "../../src/utils/phone";

export default function ContactDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items, isLoading, updateMutation, deleteMutation, verifyMutation } = useContacts();
  const contact = useMemo(() => items.find((entry) => entry.id === id), [id, items]);
  const [name, setName] = useState(contact?.name || "");
  const [phone, setPhone] = useState(contact?.phone || "");
  const [relationship, setRelationship] = useState(contact?.relationship || "");

  useEffect(() => {
    if (contact) {
      setName(contact.name);
      setPhone(contact.phone);
      setRelationship(contact.relationship);
    }
  }, [contact]);

  if (isLoading || !contact) {
    return <Loader label="Loading contact..." />;
  }

  const handleUpdate = async () => {
    try {
      await updateMutation.mutateAsync({
        id: contact.id,
        input: {
          name: name.trim(),
          phone: normalizePhoneNumber(phone),
          relationship: relationship.trim(),
        },
      });
      router.back();
    } catch (error) {
      Alert.alert("Update failed", error instanceof Error ? error.message : "Unable to update contact.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(contact.id);
      router.back();
    } catch (error) {
      Alert.alert("Delete failed", error instanceof Error ? error.message : "Unable to delete contact.");
    }
  };

  const handleVerify = async () => {
    try {
      const result = await verifyMutation.mutateAsync(contact.id);
      if (result.verificationLink) {
        Alert.alert("Verification link ready", "Fallback mode is active. Open the link now or share it manually.", [
          { text: "Cancel", style: "cancel" },
          {
            text: "Open Link",
            onPress: () => {
              Linking.openURL(result.verificationLink!).catch(() => undefined);
            },
          },
        ]);
        return;
      }

      Alert.alert("Verification sent", "Verification request was sent successfully.");
    } catch (error) {
      Alert.alert("Verification failed", error instanceof Error ? error.message : "Unable to resend verification.");
    }
  };

  return (
    <Screen scrollable header={<Header title={contact.name} subtitle={contact.isDefault ? "Default emergency service contact" : "Manage verification and details."} />}>
      <View className="gap-4">
        <Input label="Name" value={name} onChangeText={setName} editable={!contact.isDefault} />
        <Input label="Phone" value={phone} onChangeText={setPhone} editable={!contact.isDefault} />
        <Input label="Relationship" value={relationship} onChangeText={setRelationship} editable={!contact.isDefault} />
        {!contact.isDefault ? (
          <>
            <Button loading={updateMutation.isPending} onPress={handleUpdate}>
              Save Changes
            </Button>
            {!contact.verified ? (
              <Button variant="secondary" loading={verifyMutation.isPending} onPress={handleVerify}>
                Resend Verification
              </Button>
            ) : null}
            <Button variant="ghost" loading={deleteMutation.isPending} onPress={handleDelete}>
              Delete Contact
            </Button>
          </>
        ) : null}
      </View>
    </Screen>
  );
}
