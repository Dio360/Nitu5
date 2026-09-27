import React, { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { api, naira } from "@/api";
import { pretty } from "@/theme";
import { Btn } from "@/components/Btn";

interface Offer {
  id: string;
  seats: number;
  status: string;
  offeredFareKobo: number;
  agreedFareKobo: number | null;
  commissionKobo: number;
  driverEarningsKobo: number;
  rider: { firstName: string; lastName: string; rating: number | null; verificationTier: string };
}

interface ManifestRow {
  id: string;
  seats: number;
  status: string;
  pickupLabel: string;
  dropoffLabel: string;
  rider: { firstName: string; lastName: string };
}

interface Trip {
  id: string;
  originLabel: string;
  destinationLabel: string;
  departureAt: string;
  status: string;
  seatsTotal: number;
  seatsBooked: number;
}

export default function DriveTrip(): React.JSX.Element {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [manifest, setManifest] = useState<ManifestRow[]>([]);
  const [code, setCode] = useState("");
  const [counters, setCounters] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    if (!id) return;
    setTrip(await api<Trip>(`/trips/${id}`));
    try {
      setOffers(await api<Offer[]>(`/trips/${id}/offers`));
    } catch {
      setOffers([]);
    }
    try {
      setManifest(await api<ManifestRow[]>(`/trips/${id}/manifest`));
    } catch {
      setManifest([]);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const act = async (path: string, body?: object): Promise<void> => {
    setMsg("");
    try {
      await api(path, { method: "POST", body: body ? JSON.stringify(body) : undefined });
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed");
    }
  };

  const showCode = async (): Promise<void> => {
    try {
      const res = await api<{ code: string }>(`/qr/session`, {
        method: "POST",
        body: JSON.stringify({ tripId: id }),
      });
      setCode(res.code);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "No code");
    }
  };

  if (!trip) return <ActivityIndicator style={s.spin} size="large" />;

  return (
    <ScrollView style={s.wrap} contentContainerStyle={s.content}>
      <View style={s.card}>
        <Text style={s.route}>
          {trip.originLabel} → {trip.destinationLabel}
        </Text>
        <Text style={s.meta}>
          {new Date(trip.departureAt).toLocaleString()} · {trip.seatsBooked}/{trip.seatsTotal} taken · {pretty(trip.status)}
        </Text>
      </View>

      <View style={s.card}>
        <Text style={s.dname}>Trip day</Text>
        <Btn title="Show pickup code" onPress={showCode} kind="dark" />
        {code ? <Text style={s.code}>{code}</Text> : null}
        <Btn title="I'm here" onPress={() => act(`/trips/${id}/arriving`)} kind="ghost" />
        <Btn title="Start trip" onPress={() => act(`/trips/${id}/start`)} />
        <Btn title="Finish trip" onPress={() => act(`/trips/${id}/complete`)} kind="green" />
      </View>

      <View style={s.card}>
        <Text style={s.dname}>Offers ({offers.length})</Text>
        {offers.map((o) => (
          <View key={o.id} style={s.offer}>
            <Text style={s.meta}>
              {o.rider.firstName} ⭐ {o.rider.rating ?? "new"} · {o.seats} seat(s) · offers {naira(o.offeredFareKobo)}
            </Text>
            <Text style={s.meta}>
              {pretty(o.status)}
              {o.agreedFareKobo != null
                ? ` · agreed ${naira(o.agreedFareKobo)} (fee ${naira(o.commissionKobo)}, you keep ${naira(o.driverEarningsKobo)})`
                : ""}
            </Text>
            {(o.status === "OFFERED" || o.status === "COUNTERED") && (
              <View style={s.orow}>
                <View style={s.oflex}>
                  <Btn title="Accept" onPress={() => act(`/bookings/${o.id}/accept`)} />
                </View>
                <View style={s.oflex}>
                  <Btn title="Decline" onPress={() => act(`/bookings/${o.id}/decline`)} kind="danger" />
                </View>
              </View>
            )}
            {(o.status === "OFFERED" || o.status === "COUNTERED") && (
              <View style={s.orow}>
                <TextInput
                  style={[s.input, s.oflex]}
                  placeholder="Counter total ₦"
                  value={counters[o.id] ?? ""}
                  onChangeText={(v) => setCounters((c) => ({ ...c, [o.id]: v }))}
                  keyboardType="number-pad"
                />
                <View style={s.oflex}>
                  <Btn
                    title="Counter"
                    kind="ghost"
                    onPress={() =>
                      act(`/bookings/${o.id}/counter`, { amountKobo: Math.round(Number(counters[o.id]) * 100) })
                    }
                  />
                </View>
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={s.card}>
        <Text style={s.dname}>Who is in my car ({manifest.length})</Text>
        {manifest.map((m) => (
          <Text key={m.id} style={s.meta}>
            {m.rider.firstName} {m.rider.lastName} · {m.seats} seat(s) · {m.pickupLabel} → {m.dropoffLabel} · {pretty(m.status)}
          </Text>
        ))}
      </View>
      {msg ? <Text style={s.msg}>{msg}</Text> : null}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#F3F1EE" },
  content: { padding: 16, paddingBottom: 40 },
  spin: { flex: 1 },
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
  route: { fontSize: 19, fontWeight: "900" },
  meta: { fontSize: 13, color: "#333", marginTop: 3 },
  dname: { fontSize: 17, fontWeight: "800", marginBottom: 8 },
  code: { fontSize: 34, fontWeight: "900", textAlign: "center", letterSpacing: 2, marginVertical: 12 },
  offer: { borderTopWidth: 1, borderTopColor: "#E7E4D8", paddingTop: 8, marginTop: 8 },
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
