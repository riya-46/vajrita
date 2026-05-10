import { Link } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { Header } from "../../src/components/ui/Header";
import { Input } from "../../src/components/ui/Input";
import { Loader } from "../../src/components/ui/Loader";
import { Screen } from "../../src/components/ui/Screen";
import { useContacts } from "../../src/hooks/useContacts";
import { useContactsStore } from "../../src/store/contacts.store";

export default function ContactsScreen() {
  const search = useContactsStore((state) => state.search);
  const setSearch = useContactsStore((state) => state.setSearch);
  const { items, isLoading, verifyMutation } = useContacts();

  if (isLoading) {
    return <Loader label="Loading trusted contacts..." />;
  }

  return (
    <Screen scrollable header={<Header title="Trusted Contacts" subtitle="Keep your emergency network verified and ready." />}>
      <Input label="Search contacts" value={search} onChangeText={setSearch} placeholder="Search by name or phone" />
      <Link href="/contacts/new" asChild>
        <Pressable className="rounded-2xl border border-dashed border-accent p-4">
          <Text className="text-center text-base font-bold text-accent">Add Trusted Contact</Text>
        </Pressable>
      </Link>
      <View className="gap-3">
        {items.map((contact) => (
          <View key={contact.id} className="rounded-3xl border border-border bg-panel p-4">
            <Link href={{ pathname: "/contacts/[id]", params: { id: contact.id } }} asChild>
              <Pressable>
                <View className="flex-row items-start justify-between gap-4">
                  <View className="flex-1 gap-1">
                    <Text className="text-lg font-bold text-text">{contact.name}</Text>
                    <Text className="text-sm text-muted">{contact.phone}</Text>
                    <Text className="text-sm text-muted">{contact.relationship}</Text>
                  </View>
                  <View className={`rounded-full px-3 py-2 ${contact.verified ? "bg-emerald-800" : "bg-amber-700"}`}>
                    <Text className="text-xs font-bold text-white">{contact.verified ? "Verified" : "Pending"}</Text>
                  </View>
                </View>
              </Pressable>
            </Link>
            {!contact.verified && !contact.isDefault ? (
              <Pressable
                className="mt-4 rounded-2xl bg-panelMuted px-4 py-3"
                onPress={() => verifyMutation.mutate(contact.id)}
              >
                {verifyMutation.isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-center font-semibold text-text">Send Verification Link</Text>
                )}
              </Pressable>
            ) : null}
          </View>
        ))}
      </View>
    </Screen>
  );
}
