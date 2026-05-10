import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#f7f9fe",
          borderTopColor: "#dbe3f1",
          height: 64,
          paddingTop: 6,
        },
        tabBarActiveTintColor: "#2f55e7",
        tabBarInactiveTintColor: "#7b86a1",
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="contacts" options={{ title: "Contacts" }} />
      <Tabs.Screen name="tracking" options={{ title: "Tracking" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
