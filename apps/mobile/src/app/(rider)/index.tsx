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
import { pretty } from "@/theme";
import { useAuth } from "@/auth";
import { Btn } from "@/components/Btn";

type When = "NOW" | "SCHEDULE";
type Ride = "SHARED" | "PRIVATE";

interface Recent {
  trip: { destinationLabel: string };
}

export default function Home(): React.JSX.Element {
  const { user } = useAuth();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [when, setWhen] = useState<When>("NOW");
  const [date, setDate] = useState("");
  const [ride, setRide] = useState<Ride>("SHARED");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [recents, setRecents] = useState<string[]>([]);
  const [wallet, setWallet] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const loadMeta = useCallback(async () => {
    try {
      const mine = await api<Array<Recent & { id: string }>>("/bookings/mine");
      const seen: string[] = [];
      for (const b of mine) {
        const d = b.trip.destinationLabel;
        if (d && !seen.includes(d) && seen.length < 3) seen.push(d);
      }
      setRecents(seen);
    } catch {
      setRecents([]);
    }
    try {
      const w = await api<{ balanceKobo: number }>("/wallet/mine");
      setWallet(w.balanceKobo);
    } catch {
      setWallet(null);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadMeta();
    }, [loadMeta]),
  );

  const search = async (): Promise<void> => {
    setBusy(true);
    setError("");
    setSearched(true);
    try {
      const parts: string[] = [];
      if (from.trim()) parts.push(`from=${encodeURIComponent(from.trim())}`);
      if (to.trim()) parts.push(`to=${encodeURIComponent(to.trim())}`);
      parts.push(`rideModel=${ride}`);
      if (when === "SCHEDULE" && date.trim()) parts.push(`date=${date.trim()}`);
      setTrips(await api<Trip[]>(`/trips/search?${parts.join("&")}`));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed — check connection");
    } finally {
      setBusy(false);
    }
  };

  const fare = (t: Trip): string =>
    t.rideModel === "SHARED" ? `${naira(t.farePerSeatKobo)} / seat` : `${naira(t.privateFareKobo)} / ride`;

  return (
    <FlatList
      style={s.wrap}
      contentContainerStyle={s.content}
      data={trips}
      keyExtractor={(t) => t.id}
      ListHeaderComponent={
        <>
          <Text style={s.hello}>
            {greet()}, {user?.firstName}
          </Text>
          <View style={s.where}>
            <Text style={s.wheretitle}>Where to?</Text>
            <TextInput style={s.input} placeholder="📍 From" value={from} onChangeText={setFrom} />
            <TextInput style={s.input} placeholder="🏁 To" value={to} onChangeText={setTo} />
            <View style={s.row}>
              {(["NOW", "SCHEDULE"] as When[]).map((w) => (
                <TouchableOpacity key={w} style={[s.pick, when === w && s.pickOn]} onPress={() => setWhen(w)}>
                  <Text style={s.picktxt}>{w === "NOW" ? "⚡ Now" : "📅 Schedule"}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {when === "SCHEDULE" ? (
              <TextInput style={s.input} placeholder="Date YYYY-MM-DD" value={date} onChangeText={setDate} />
            ) : null}
          </View>
          <View style={s.row}>
            {(["SHARED", "PRIVATE"] as Ride[]).map((r) => (
              <TouchableOpacity key={r} style={[s.cat, ride === r && s.catOn]} onPress={() => setRide(r)}>
                <Text style={s.catemoji}>{r === "SHARED" ? "🤝" : "🔒"}</Text>
                <Text style={s.cattxt}>{r === "SHARED" ? "Shared" : "Private"}</Text>
                <Text style={s.catsub}>{r === "SHARED" ? "Cheapest" : "Whole car"}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={s.payrow}>
            <Text style={s.paytxt}>💵 {wallet == null ? "Wallet…" : naira(wallet)}</Text>
            <Text style={s.paylink} onPress={() => router.push("/(rider)/account")}>
              Top up ›
            </Text>
          </View>
          <Btn title={busy ? "Finding…" : "See prices"} onPress={search} disabled={busy} />
          {error ? <Text style={s.error}>{error}</Text> : null}
          {recents.length > 0 && !searched ? (
            <View style={s.recent}>
              <Text style={s.dname}>Recent</Text>
              {recents.map((r) => (
                <TouchableOpacity
                  key={r}
                  onPress={() => {
                    setTo(r);
                  }}
                >
                  <Text style={s.recentitem}>🕑 {r}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
          {searched && !busy && !error ? (
            <Text style={s.count}>
              {trips.length === 0 ? "No rides — try other words or day." : `${trips.length} option(s). Prices upfront, no surprises.`}
            </Text>
          ) : null}
        </>
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          style={s.card}
          onPress={() => router.push({ pathname: "/trip/[id]", params: { id: item.id } })}
        >
          <Text style={s.route}>
            {item.originLabel} → {item.destinationLabel}
          </Text>
          <Text style={s.meta}>
            🕑 {new Date(item.departureAt).toLocaleString()} · 💺 {item.seatsLeft} left
          </Text>
          <Text style={s.meta}>
            {item.driver.firstName} ⭐ {item.driver.rating ?? "new"} · {pretty(item.driver.verificationTier)}
          </Text>
          <Text style={s.fare}>{fare(item)}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const greet = (): string => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#F3F1EE" },
  content: { padding: 16, paddingBottom: 40 },
  hello: { fontSize: 24, fontWeight: "900", marginBottom: 12 },
  where: {
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
  wheretitle: { fontSize: 20, fontWeight: "900", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#E4E1D8",
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#F3F1EE",
    marginBottom: 10,
  },
  row: { flexDirection: "row", gap: 8 },
  pick: { flex: 1, borderWidth: 2, borderColor: "#000", borderRadius: 12, padding: 10, alignItems: "center", marginBottom: 4 },
  pickOn: { backgroundColor: "#FFC900" },
  picktxt: { fontWeight: "800" },
  cat: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E4E1D8",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  catOn: { backgroundColor: "#34BB78" },
  catemoji: { fontSize: 26 },
  cattxt: { fontWeight: "900", fontSize: 16, marginTop: 4 },
  catsub: { fontSize: 12, color: "#787664", fontWeight: "700" },
  payrow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  paytxt: { fontWeight: "800", fontSize: 15 },
  paylink: { fontWeight: "800", fontSize: 15 },
  recent: { marginBottom: 8 },
  recentitem: { fontSize: 16, fontWeight: "700", paddingVertical: 8 },
  dname: { fontSize: 17, fontWeight: "800", marginBottom: 4 },
  count: { color: "#787664", fontWeight: "700", marginBottom: 8 },
  error: { color: "#E02020", fontWeight: "700", marginBottom: 8 },
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
  route: { fontSize: 17, fontWeight: "800" },
  meta: { fontSize: 13, color: "#787664", marginTop: 2 },
  fare: { fontSize: 18, fontWeight: "900", marginTop: 6 },
});
