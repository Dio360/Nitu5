import React, { useCallback, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { api } from "@/api";
import { useAuth } from "@/auth";
import { Btn } from "@/components/Btn";

interface MyTrip {
  id: string;
  originLabel: string;
  destinationLabel: string;
  departureAt: string;
  status: string;
  seatsTotal: number;
  seatsBooked: number;
}

export default function Drive(): React.JSX.Element {
  const { user } = useAuth();
  const [trips, setTrips] = useState<MyTrip[]>([]);
  const isDriver = user?.role === "PRIVATE_DRIVER" || user?.role === "PROFESSIONAL_DRIVER";

  const load = useCallback(async () => {
    if (isDriver) setTrips(await api<MyTrip[]>("/trips/mine"));
  }, [isDriver]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (!isDriver) {
    return (
      <View style={s.wrap}>
        <View style={s.card}>
          <Text style={s.title}>You are riding.</Text>
          <Text style={s.meta}>Switch to a driver account in your profile to post trips and earn.</Text>
        </View>
        <Btn title="Open my profile" onPress={() => router.push("/profile")} kind="dark" />
      </View>
    );
  }

  return (
    <View style={s.wrap}>
      <Btn title="+ Post a trip" onPress={() => router.push("/post-trip")} kind="pink" />
      <Btn title="My cars" onPress={() => router.push("/cars")} kind="ghost" />
      <FlatList
        data={trips}
        keyExtractor={(t) => t.id}
        ListEmptyComponent={<Text style={s.empty}>No trips yet — post your first one.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={s.card}
            onPress={() => router.push({ pathname: "/drive-trip/[id]", params: { id: item.id } })}
          >
            <Text style={s.route}>
              {item.originLabel} → {item.destinationLabel}
            </Text>
            <Text style={s.meta}>
              {new Date(item.departureAt).toLocaleString()} · {item.seatsBooked}/{item.seatsTotal} seats taken
            </Text>
            <Text style={s.status}>{item.status}</Text>
          </TouchableOpacity>
        )}
      />
      <Button title="Refresh" onPress={load} />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, padding: 16, backgroundColor: "#FFF9EF" },
  empty: { textAlign: "center", color: "#5A6B87", marginTop: 32 },
  card: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    elevation: 4,
  },
  title: { fontSize: 20, fontWeight: "900" },
  route: { fontSize: 17, fontWeight: "800" },
  meta: { fontSize: 13, color: "#5A6B87", marginTop: 2 },
  status: { fontSize: 15, fontWeight: "900", marginTop: 6 },
});
