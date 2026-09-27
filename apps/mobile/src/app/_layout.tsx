import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack, router, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "@/auth";

const Gate: React.FC = () => {
  const { user, loading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;
    const onLogin = segments[0] === "login";
    if (!user && !onLogin) router.replace("/login");
    else if (user && onLogin) router.replace("/");
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Find a ride" }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="trip/[id]" options={{ title: "Trip" }} />
      <Stack.Screen name="bookings" options={{ title: "My bookings" }} />
      <Stack.Screen name="booking/[id]" options={{ title: "Booking" }} />
      <Stack.Screen name="drive" options={{ title: "Drive & earn" }} />
      <Stack.Screen name="cars" options={{ title: "My cars" }} />
      <Stack.Screen name="post-trip" options={{ title: "Post a trip" }} />
      <Stack.Screen name="drive-trip/[id]" options={{ title: "My trip" }} />
      <Stack.Screen name="profile" options={{ title: "Profile" }} />
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
