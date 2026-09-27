import React from "react";
import { Text } from "react-native";
import { Tabs } from "expo-router";

const icon = (emoji: string) => (): React.JSX.Element => <Text style={{ fontSize: 22 }}>{emoji}</Text>;

/** Driver world: Home · Trips · Account. */
export default function DriverTabs(): React.JSX.Element {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#6F6455",
        tabBarLabelStyle: { fontWeight: "800", fontSize: 12 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: icon("🏠") }} />
      <Tabs.Screen name="trips" options={{ title: "Trips", tabBarIcon: icon("🚗") }} />
      <Tabs.Screen name="account" options={{ title: "Account", tabBarIcon: icon("👤") }} />
    </Tabs>
  );
}
