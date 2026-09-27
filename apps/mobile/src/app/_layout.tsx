import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack, router, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "@/auth";

const Gate: React.FC = () => {
  const { user, loading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;
    const top = segments[0];
    const onLogin = top === "login";
    if (!user && !onLogin) router.replace("/login");
    else if (user && onLogin) {
      router.replace(user.role === "RIDER" ? "/(rider)/index" : "/(driver)/index");
    } else if (user && !top) {
      router.replace(user.role === "RIDER" ? "/(rider)/index" : "/(driver)/index");
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(rider)" />
      <Stack.Screen name="(driver)" />
      <Stack.Screen name="login" />
      <Stack.Screen name="trip/[id]" options={{ headerShown: true, title: "Trip" }} />
      <Stack.Screen name="booking/[id]" options={{ headerShown: true, title: "Booking" }} />
      <Stack.Screen name="support" options={{ headerShown: true, title: "Help" }} />
    </Stack>
  );
};

export default function RootLayout(): React.JSX.Element {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}
