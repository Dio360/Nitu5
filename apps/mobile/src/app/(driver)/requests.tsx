import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { api, naira } from "@/api";
import { pretty } from "@/theme";
import { Btn } from "@/components/Btn";

interface Offer {
  id: string;
  seats: number;
  status: string;
  offeredFareKobo: number;
  agreedFareKobo: number | null;
  trip: { id: string; originLabel: string; destinationLabel: string; departureAt: string };
  rider: { firstName: string; lastName: string; rating: number | null };
}

/** Every rider asking for a seat, newest first. One tap to answer. */
export default function Requests(): React.JSX.Element {
  const [rows, setRows] = useState<Offer[]>([]);
  const [counters, setCounters] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    try {
      setRows(await api<Offer[]>("/bookings/offers/mine"));
    } catch {
      setRows([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const act = async (id: string, path: string, body?: object): Promise<void> => {
    setMsg("");
    try {
      await api(`/bookings/${id}/${path}`, { method: "POST", body: body ? JSON.stringify(body) : undefined });
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed");
    }
  };

  const open = rows.filter((r) => r.status === "OFFERED" || r.status === "COUNTERED");
  const done = rows.filter((r) => r.status !== "OFFERED" && r.status !== "COUNTERED");

  const card = (o: Offer): React.JSX.Element => (
    <View key={o.id} style={s.card}>
      <Text style={s.route}>
        {o.trip.originLabel} → {o.trip.destinationLabel}
      </Text>
      <Text style={s.meta}>
        {o.rider.firstName} ⭐ {o.rider.rating ?? "new"} · {o.seats} seat(s) · offers {naira(o.offeredFareKobo)}
      </Text>
      <Text style={s.status}>{pretty(o.status)}</Text>
      {(o.status === "OFFERED" || o.status === "COUNTERED") && (
        <>
          <View style={s.orow}>
            <View style={s.oflex}>
              <Btn title="✅ Accept" onPress={() => act(o.id, "accept")} />
            </View>
            <View style={s.oflex}>
              <Btn title="❌ Decline" onPress={() => act(o.id, "decline")} kind="danger" />
            </View>
          </View>
          <View style={s.orow}>
            <TextInput
              style={[s.input, s.oflex]}
              placeholder="Counter ₦"
              value={counters[o.id] ?? ""}
              onChangeText={(v) => setCounters((c) => ({ ...c, [o.id]: v }))}
              keyboardType="number-pad"
            />
            <View style={s.oflex}>
              <Btn
                title="Counter"
                kind="ghost"
                onPress={() => act(o.id, "counter", { amountKobo: Math.round(Number(counters[o.id]) * 100) })}
              />
            </View>
          </View>
        </>
      )}
    </View>
  );

  return (
    <FlatList
      style={s.wrap}
      contentContainerStyle={s.content}
      data={[{ key: "h" }]}
      keyExtractor={(i) => i.key}
      renderItem={() => (
        <>
          <Text style={s.dname}>🔔 New ({open.length})</Text>
          {open.length === 0 ? <Text style={s.empty}>No waiting riders.</Text> : open.map(card)}
          <Text style={s.dname}>📋 Answered ({done.length})</Text>
          {done.map(card)}
          {msg ? <Text style={s.msg}>{msg}</Text> : null}
        </>
      )}
    />
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#F3F1EE" },
  content: { padding: 16, paddingBottom: 40 },
  empty: { color: "#787664", marginBottom: 12 },
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
  meta: { fontSize: 13, color: "#333", marginTop: 3 },
  status: { fontSize: 15, fontWeight: "900", marginTop: 6 },
  dname: { fontSize: 17, fontWeight: "800", marginVertical: 8 },
  orow: { flexDirection: "row", gap: 8, marginTop: 8 },
  oflex: { flex: 1 },
  input: {
    borderWidth: 1,
    borderColor: "#E4E1D8",
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  msg: { fontWeight: "700", color: "#E02020", textAlign: "center" },
});
