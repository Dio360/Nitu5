import React, { useCallback, useState } from "react";
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { Trip, api, naira } from "@/api";

type Pay = "CASH" | "WALLET";

export default function TripDetails(): React.JSX.Element {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [seats, setSeats] = useState("1");
  const [nairaAmount, setNairaAmount] = useState("");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [pay, setPay] = useState<Pay>("CASH");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (id) api<Trip>(`/trips/${id}`).then(setTrip);
    }, [id]),
  );

  const offer = async (): Promise<void> => {
    setBusy(true);
    setMsg("");
    try {
      const res = await api<{ id: string; status: string }>(`/bookings`, {
        method: "POST",
        body: JSON.stringify({
          tripId: id,
          seats: Number(seats) || 1,
          offeredFareKobo: Math.round(Number(nairaAmount) * 100) || 0,
          pickupLabel: pickup || trip?.originLabel,
          dropoffLabel: dropoff || trip?.destinationLabel,
          paymentMethod: pay,
        }),
      });
      setMsg(`Offer sent (${res.status}). Watch My bookings for the driver's answer.`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Offer failed");
    } finally {
      setBusy(false);
    }
  };

  if (!trip) return <ActivityIndicator style={s.spin} size="large" />;

  return (
    <ScrollView style={s.wrap} contentContainerStyle={s.content}>
      <View style={s.card}>
        <Text style={s.route}>
          {trip.originLabel} → {trip.destinationLabel}
        </Text>
        <Text style={s.meta}>{new Date(trip.departureAt).toLocaleString()}</Text>
        <Text style={s.meta}>
          {trip.rideModel} · {trip.seatsLeft} of {trip.seatsTotal} seats left
        </Text>
        <Text style={s.fare}>
          {trip.rideModel === "SHARED"
            ? `${naira(trip.farePerSeatKobo)} / seat`
            : `${naira(trip.privateFareKobo)} / car`}
        </Text>
      </View>
      <View style={s.card}>
        <Text style={s.dname}>
          {trip.driver.firstName} {trip.driver.lastName} ⭐ {trip.driver.rating ?? "new"}
        </Text>
        <Text style={s.meta}>{trip.driver.verificationTier}</Text>
      </View>
      <View style={s.card}>
        <Text style={s.dname}>Offer your price (total, ₦)</Text>
        <TextInput style={s.input} placeholder="Seats" value={seats} onChangeText={setSeats} keyboardType="number-pad" />
        <TextInput
          style={s.input}
          placeholder="Total price, e.g. 2700"
          value={nairaAmount}
          onChangeText={setNairaAmount}
          keyboardType="number-pad"
        />
        <TextInput style={s.input} placeholder="Pickup (optional)" value={pickup} onChangeText={setPickup} />
        <TextInput style={s.input} placeholder="Drop-off (optional)" value={dropoff} onChangeText={setDropoff} />
        <View style={s.payrow}>
          {(["CASH", "WALLET"] as Pay[]).map((p) => (
            <TouchableOpacity
              key={p}
              style={[s.pay, pay === p && s.payOn]}
              onPress={() => setPay(p)}
            >
              <Text style={s.paytxt}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button title={busy ? "Sending…" : "Send offer"} onPress={offer} disabled={busy} />
        {msg ? <Text style={s.msg}>{msg}</Text> : null}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#FFF9EF" },
  content: { padding: 16, paddingBottom: 40 },
  spin: { flex: 1 },
  card: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    elevation: 4,
  },
  route: { fontSize: 20, fontWeight: "900" },
  meta: { fontSize: 14, color: "#5A6B87", marginTop: 4 },
  fare: { fontSize: 22, fontWeight: "900", marginTop: 8 },
  dname: { fontSize: 17, fontWeight: "800", marginBottom: 8 },
  input: {
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  payrow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  pay: { flex: 1, borderWidth: 2, borderColor: "#000", borderRadius: 12, padding: 10, alignItems: "center" },
  payOn: { backgroundColor: "#FFC900" },
  paytxt: { fontWeight: "800" },
  msg: { marginTop: 10, fontWeight: "700", color: "#0D60D8" },
});
