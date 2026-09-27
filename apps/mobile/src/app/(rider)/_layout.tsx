import React from "react";
import { Text } from "react-native";
import { Tabs } from "expo-router";

const icon = (emoji: string) => (): React.JSX.Element => <Text style={{ fontSize: 22 }}>{emoji}</Text>;

/** Rider world: Home · Services · Activity · Account (Uber-style tabs). */
export default function RiderTabs(): React.JSX.Element {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#787664",
        tabBarLabelStyle: { fontWeight: "800", fontSize: 12 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: icon("🏠") }} />
      <Tabs.Screen name="services" options={{ title: "Services", tabBarIcon: icon("🧰") }} />
      <Tabs.Screen name="activity" options={{ title: "Activity", tabBarIcon: icon("🧾") }} />
      <Tabs.Screen name="account" options={{ title: "Account", tabBarIcon: icon("👤") }} />
    </Tabs>
  );
}
