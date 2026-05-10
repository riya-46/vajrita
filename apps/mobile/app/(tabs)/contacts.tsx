import { Link, router } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, Alert, Linking, Pressable, Text, View } from "react-native";
import { BackPill, SurfaceCard } from "../../src/components/ui/SoftUI";
import { ErrorState } from "../../src/components/ui/ErrorState";
import { Input } from "../../src/components/ui/Input";
import { Loader } from "../../src/components/ui/Loader";
import { Screen } from "../../src/components/ui/Screen";
import { surfaceShadow } from "../../src/constants/theme";
import { useContacts } from "../../src/hooks/useContacts";
import { normalizePhoneNumber } from "../../src/utils/phone";

export default function ContactsScreen() {
  const { items, isLoading, createMutation, deleteMutation, verifyMutation } = useContacts();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const trustedContacts = useMemo(() => items.filter((contact) => !contact.isDefault), [items]);
  const emergencyContacts = useMemo(() => items.filter((contact) => contact.isDefault), [items]);

  if (isLoading) {
    return <Loader label="Loading emergency contacts..." />;
  }

  const handleAdd = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert("Missing details", "Enter both name and phone number.");
      return;
    }

    try {
      await createMutation.mutateAsync({
        name: name.trim(),
        phone: normalizePhoneNumber(phone),
        relationship: "Trusted Contact",
      });
      setName("");
      setPhone("");
    } catch (error) {
      Alert.alert("Add failed", error instanceof Error ? error.message : "Could not add the trusted contact.");
    }
  };

  const handleVerify = async (contactId: string) => {
    try {
      const result = await verifyMutation.mutateAsync(contactId);
      if (result.verificationLink) {
        Alert.alert("Verification link ready", "Fallback mode is active. Open the link on this device or share it manually.", [
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
      Alert.alert("Verification failed", error instanceof Error ? error.message : "Could not send the verification link.");
    }
  };

  return (
    <Screen scrollable>
      <View className="gap-5 py-4">
        <BackPill onPress={() => router.push("/(tabs)/home")} />

        <SurfaceCard className="gap-3">
          <Text className="text-[22px] font-extrabold text-text">Emergency Contacts</Text>
          <Text className="text-lg leading-7 text-muted">
            Add your trustworthy people as emergency contacts and keep default emergency numbers close.
          </Text>

          <View className="gap-3">
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Input label="Name" value={name} onChangeText={setName} placeholder="Name" />
              </View>
              <View className="flex-1">
                <Input label="Phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="Phone" />
              </View>
            </View>
            <Pressable
              onPress={handleAdd}
              className="self-center rounded-[18px] bg-accent px-10 py-4"
              style={surfaceShadow}
            >
              {createMutation.isPending ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-lg font-semibold text-white">Add</Text>
              )}
            </Pressable>
          </View>
        </SurfaceCard>

        <SurfaceCard className="gap-4">
          {trustedContacts.length ? (
            trustedContacts.map((contact) => (
              <View
                key={contact.id}
                className="rounded-[26px] border border-border bg-panel px-5 py-5"
                style={surfaceShadow}
              >
                <View className="flex-row items-center justify-between gap-4">
                  <Pressable onPress={() => router.push({ pathname: "/contacts/[id]", params: { id: contact.id } })} className="flex-1">
                    <Text className="text-[18px] font-bold text-text">{contact.name}</Text>
                    <Text className="mt-2 text-lg text-muted">{contact.phone}</Text>
                    <Text className="mt-1 text-sm text-muted">{contact.relationship}</Text>
                  </Pressable>

                  <View className="items-end gap-3">
                    <Pressable
                      onPress={() => deleteMutation.mutate(contact.id)}
                      className="rounded-[18px] border border-border bg-panel px-5 py-3"
                    >
                      <Text className="text-base font-semibold text-text">Remove</Text>
                    </Pressable>
                    {!contact.verified ? (
                      <Pressable
                        onPress={() => handleVerify(contact.id)}
                        className="rounded-[18px] bg-accentMuted px-4 py-2"
                      >
                        {verifyMutation.isPending ? (
                          <ActivityIndicator color="#2f55e7" />
                        ) : (
                          <Text className="font-semibold text-accent">Verify</Text>
                        )}
                      </Pressable>
                    ) : (
                      <View className="rounded-full bg-[#ebfff1] px-4 py-2">
                        <Text className="font-semibold text-[#1d8c4d]">Verified</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))
          ) : (
            <ErrorState
              title="No trusted contacts yet"
              message="Add at least one person so SOS, fake call, and tracking can reach someone useful."
            />
          )}
        </SurfaceCard>

        <SurfaceCard className="gap-4">
          {emergencyContacts.map((contact) => (
            <View key={contact.id} className="flex-row items-center justify-between gap-4 rounded-[22px] bg-panel px-5 py-4">
              <View className="flex-1 gap-1">
                <Text className="text-[18px] font-semibold text-text">{contact.name}</Text>
                <Text className="text-sm text-muted">{contact.relationship}</Text>
              </View>
              <Pressable
                onPress={() => Linking.openURL(`tel:${contact.phone}`).catch(() => undefined)}
                className="rounded-[18px] border border-border bg-panel px-5 py-3"
              >
                <Text className="text-lg font-semibold text-text">{contact.phone}</Text>
              </Pressable>
            </View>
          ))}
        </SurfaceCard>

        <Link href="/contacts/new" asChild>
          <Pressable className="self-center rounded-full border border-border bg-panel px-5 py-3">
            <Text className="font-semibold text-accent">Open full contact form</Text>
          </Pressable>
        </Link>
      </View>
    </Screen>
  );
}
