import React, { useCallback, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { api, naira } from "@/api";

interface Booking {
  id: string;
  seats: number;
  status: string;
  offeredFareKobo: number;
  agreedFareKobo: number | null;
  trip: { originLabel: string; destinationLabel: string; departureAt: string };
}

export default function Bookings(): React.JSX.Element {
  const [rows, setRows] = useState<Booking[]>([]);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setBusy(true);
    try {
      setRows(await api<Booking[]>("/bookings/mine"));
    } finally {
      setBusy(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <View style={s.wrap}>
      <FlatList
        data={rows}
        keyExtractor={(b) => b.id}
        ListEmptyComponent={!busy ? <Text style={s.empty}>No offers yet — find a ride first.</Text> : null}
        renderItem={({ item }) => (
          <TouchableOpacity style={s.card} onPress={() => router.push(`/booking/${item.id}`)}>
            <Text style={s.route}>
              {item.trip.originLabel} → {item.trip.destinationLabel}
            </Text>
            <Text style={s.meta}>
              {item.seats} seat(s) · offered {naira(item.offeredFareKobo)}
              {item.agreedFareKobo != null ? ` · agreed ${naira(item.agreedFareKobo)}` : ""}
            </Text>
            <Text style={s.status}>{item.status}</Text>
          </TouchableOpacity>
        )}
      />
      <Button title="Refresh" onPress={load} disabled={busy} />
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
  route: { fontSize: 17, fontWeight: "800" },
  meta: { fontSize: 13, color: "#5A6B87", marginTop: 2 },
  status: { fontSize: 15, fontWeight: "900", marginTop: 6 },
});
