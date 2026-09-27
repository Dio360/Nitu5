import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "@/auth";

/** Front door: riders go left, drivers go right. Never a dead end. */
export default function FrontDoor(): React.JSX.Element {
  const { user, loading } = useAuth();
  if (loading || !user) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return <Redirect href={user.role === "RIDER" ? "/(rider)" : "/(driver)"} />;
}
