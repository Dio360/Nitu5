import React, { useCallback, useState } from "react";
import {
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
import { Btn } from "@/components/Btn";

export default function Search(): React.JSX.Element {
  const { user } = useAuth();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const search = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      const parts: string[] = [];
      if (from.trim()) parts.push(`from=${encodeURIComponent(from.trim())}`);
      if (to.trim()) parts.push(`to=${encodeURIComponent(to.trim())}`);
      const qs = parts.length ? `?${parts.join("&")}` : "";
      setTrips(await api<Trip[]>(`/trips/search${qs}`));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed — check connection");
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

  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <View style={s.wrap}>
      <Text style={s.hello}>
        {greet}, {user?.firstName}
      </Text>
      <Text style={s.sub}>Where to today?</Text>
      <View style={s.toprow}>
        <TouchableOpacity style={s.topbtn} onPress={() => router.push("/bookings")}>
          <Text style={s.topbtntxt}>My bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.topbtn, s.topdrive]} onPress={() => router.push("/drive")}>
          <Text style={s.topbtntxt}>Drive</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.topbtn, s.topghost]} onPress={() => router.push("/profile")}>
          <Text style={[s.topbtntxt, s.topghosttxt]}>Me</Text>
        </TouchableOpacity>
      </View>
      <View style={s.row}>
        <TextInput style={[s.input, s.half]} placeholder="From" value={from} onChangeText={setFrom} />
        <TextInput style={[s.input, s.half]} placeholder="To" value={to} onChangeText={setTo} />
      </View>
      <Btn title={busy ? "Searching…" : "Find rides"} onPress={search} disabled={busy} />
      {error ? <Text style={s.error}>{error}</Text> : null}
      {!busy && !error ? (
        <Text style={s.count}>
          {trips.length === 0 ? "No rides found — try different words." : `${trips.length} ride(s) found.`}
        </Text>
      ) : null}
      <FlatList
        data={trips}
        keyExtractor={(t) => t.id}
        style={s.list}
        ListEmptyComponent={!busy ? <Text style={s.empty}>No rides yet — try clearing the boxes.</Text> : null}
        renderItem={({ item }) => (
          <TouchableOpacity style={s.card} onPress={() => router.push({ pathname: "/trip/[id]", params: { id: item.id } })}>
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
  hello: { fontSize: 24, fontWeight: "900" },
  sub: { fontSize: 15, color: "#5A6B87", marginBottom: 12 },
  toprow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  topbtn: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  topghost: { backgroundColor: "#fff", borderWidth: 2, borderColor: "#000" },
  topbtntxt: { color: "#fff", fontSize: 16, fontWeight: "800" },
  topghosttxt: { color: "#000" },
  topdrive: { backgroundColor: "#0D60D8" },
  error: { color: "#E02020", fontWeight: "700", marginTop: 8 },
  count: { color: "#5A6B87", fontWeight: "700", marginTop: 8 },
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
