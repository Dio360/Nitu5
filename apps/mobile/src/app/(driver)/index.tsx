import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { api, naira } from "@/api";
import { pretty } from "@/theme";
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

/** Driver home: money first, then today's work. */
export default function DriverHome(): React.JSX.Element {
  const { user } = useAuth();
  const [trips, setTrips] = useState<MyTrip[]>([]);
  const [net, setNet] = useState<number | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const isDriver = user?.role === "PRIVATE_DRIVER" || user?.role === "PROFESSIONAL_DRIVER";

  const load = useCallback(async () => {
    if (!isDriver) return;
    setTrips(await api<MyTrip[]>("/trips/mine"));
    try {
      const e = await api<{ driving: { trips: number; netKobo: number } }>("/earnings/me");
      setNet(e.driving.netKobo);
      setCount(e.driving.trips);
    } catch {
      setNet(null);
    }
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
          <Text style={s.meta}>Switch to a driver account in your profile to earn.</Text>
        </View>
        <Btn title="Open my profile" onPress={() => router.push("/(driver)/account")} kind="dark" />
      </View>
    );
  }

  return (
    <FlatList
      style={s.wrap}
      contentContainerStyle={s.content}
      data={trips}
      keyExtractor={(t) => t.id}
      ListHeaderComponent={
        <>
          <View style={s.card}>
            <Text style={s.big}>{net == null ? "…" : naira(net)}</Text>
            <Text style={s.meta}>Earned driving · {count ?? "…"} trips</Text>
          </View>
          <Btn title="📥 Requests" onPress={() => router.push("/(driver)/requests")} kind="green" />
          <Btn title="+ Post a trip" onPress={() => router.push("/(driver)/post-trip")} />
          <Btn title="My cars" onPress={() => router.push("/(driver)/cars")} kind="ghost" />
          <Text style={s.dname}>My trips</Text>
        </>
      }
      ListEmptyComponent={<Text style={s.empty}>No trips yet — post your first one.</Text>}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={s.card}
          onPress={() => router.push({ pathname: "/(driver)/trip/[id]", params: { id: item.id } })}
        >
          <Text style={s.route}>
            {item.originLabel} → {item.destinationLabel}
          </Text>
          <Text style={s.meta}>
            {new Date(item.departureAt).toLocaleString()} · {item.seatsBooked}/{item.seatsTotal} taken
          </Text>
          <Text style={s.status}>{pretty(item.status)}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#F3F1EE" },
  content: { padding: 16, paddingBottom: 40 },
  empty: { textAlign: "center", color: "#787664", marginTop: 16 },
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E4E1D8",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    elevation: 2,
  },
  big: { fontSize: 34, fontWeight: "900" },
  title: { fontSize: 19, fontWeight: "900" },
  route: { fontSize: 17, fontWeight: "800" },
  meta: { fontSize: 13, color: "#787664", marginTop: 2 },
  status: { fontSize: 15, fontWeight: "900", marginTop: 6 },
  dname: { fontSize: 17, fontWeight: "800", marginVertical: 8 },
});
