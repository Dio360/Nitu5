import React, { useCallback, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Trip, api, naira } from "@/api";
import { useAuth } from "@/auth";

export default function Search(): React.JSX.Element {
  const { user, logout } = useAuth();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [busy, setBusy] = useState(false);

  const search = useCallback(async () => {
    setBusy(true);
    try {
      const q = new URLSearchParams();
      if (from) q.set("from", from);
      if (to) q.set("to", to);
      setTrips(await api<Trip[]>(`/trips/search?${q.toString()}`));
    } finally {
      setBusy(false);
    }
  }, [from, to]);

  useFocusEffect(
    useCallback(() => {
      search();
    }, [search]),
  );

  const fare = (t: Trip): string =>
    t.rideModel === "SHARED" ? `${naira(t.farePerSeatKobo)} / seat` : `${naira(t.privateFareKobo)} / car`;

  return (
    <View style={s.wrap}>
      <Text style={s.hello}>
        Hello {user?.firstName} · <Text style={s.link} onPress={() => router.push("/bookings")}>my bookings</Text> ·{" "}
        <Text style={s.link} onPress={logout}>log out</Text>
      </Text>
      <View style={s.row}>
        <TextInput style={[s.input, s.half]} placeholder="From" value={from} onChangeText={setFrom} />
        <TextInput style={[s.input, s.half]} placeholder="To" value={to} onChangeText={setTo} />
      </View>
      <Button title={busy ? "Searching…" : "Find rides"} onPress={search} disabled={busy} />
      <FlatList
        data={trips}
        keyExtractor={(t) => t.id}
        style={s.list}
        ListEmptyComponent={!busy ? <Text style={s.empty}>No rides yet — try clearing the boxes.</Text> : null}
        renderItem={({ item }) => (
          <TouchableOpacity style={s.card} onPress={() => router.push(`/trip/${item.id}`)}>
            <Text style={s.route}>
              {item.originLabel} → {item.destinationLabel}
            </Text>
            <Text style={s.meta}>
              {new Date(item.departureAt).toLocaleString()} · {item.seatsLeft} seats left
            </Text>
            <Text style={s.meta}>
              {item.driver.firstName} ⭐ {item.driver.rating ?? "new"} · {item.driver.verificationTier}
            </Text>
            <Text style={s.fare}>{fare(item)}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, padding: 16, backgroundColor: "#FFF9EF" },
  hello: { fontSize: 15, fontWeight: "700", marginBottom: 12 },
  link: { color: "#0D60D8" },
  row: { flexDirection: "row", gap: 8 },
  input: {
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  half: { flex: 1 },
  list: { marginTop: 12 },
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
  fare: { fontSize: 18, fontWeight: "900", marginTop: 6 },
});
