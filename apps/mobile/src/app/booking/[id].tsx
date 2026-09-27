import React, { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { api, naira } from "@/api";
import { pretty } from "@/theme";
import { Btn } from "@/components/Btn";

interface Step {
  id: string;
  action: string;
  amountKobo: number;
  createdAt: string;
}

interface Booking {
  id: string;
  seats: number;
  status: string;
  offeredFareKobo: number;
  agreedFareKobo: number | null;
  commissionKobo: number;
  driverEarningsKobo: number;
  trip: { id: string };
}

export default function BookingDetails(): React.JSX.Element {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [msg, setMsg] = useState("");
  const [code, setCode] = useState("");

  const load = useCallback(async () => {
    if (!id) return;
    const mine = await api<Booking[]>("/bookings/mine");
    setBooking(mine.find((b) => b.id === id) ?? null);
    setSteps(await api<Step[]>(`/bookings/${id}/history`));
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const act = async (path: string): Promise<void> => {
    setMsg("");
    try {
      await api(`/bookings/${id}/${path}`, { method: "POST" });
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed");
    }
  };

  const checkin = async (): Promise<void> => {
    setMsg("");
    try {
      await api(`/qr/verify`, { method: "POST", body: JSON.stringify({ code, bookingId: id }) });
      setCode("");
      await load();
      setMsg("Checked in — have a safe trip.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Check-in failed");
    }
  };

  const sos = async (): Promise<void> => {
    setMsg("");
    try {
      await api(`/safety/sos`, { method: "POST", body: JSON.stringify({ tripId: booking?.trip.id }) });
      setMsg("SOS sent — help is being alerted.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "SOS failed");
    }
  };

  if (!booking) return <ActivityIndicator style={s.spin} size="large" />;

  return (
    <ScrollView style={s.wrap} contentContainerStyle={s.content}>
      <View style={s.card}>
        <Text style={s.status}>{pretty(booking.status)}</Text>
        <Text style={s.meta}>
          {booking.seats} seat(s) · offered {naira(booking.offeredFareKobo)}
        </Text>
        {booking.agreedFareKobo != null ? (
          <Text style={s.meta}>Agreed price: {naira(booking.agreedFareKobo)}</Text>
        ) : null}
      </View>
      <View style={s.card}>
        <Text style={s.dname}>Price history</Text>
        {steps.map((st) => (
          <Text key={st.id} style={s.meta}>
            {pretty(st.action)} · {naira(st.amountKobo)} · {new Date(st.createdAt).toLocaleTimeString()}
          </Text>
        ))}
      </View>
      {booking.status === "COUNTERED" ? <Btn title="Accept counter" onPress={() => act("agree")} kind="green" /> : null}
      {booking.status === "CONFIRMED" ? (
        <View style={s.card}>
          <Text style={s.dname}>Check in with driver's code</Text>
          <TextInput style={s.input} placeholder="e.g. N5-a1b2c3d4" value={code} onChangeText={setCode} autoCapitalize="none" />
          <Btn title="Check in" onPress={checkin} kind="dark" />
        </View>
      ) : null}
      {booking.status === "CONFIRMED" || booking.status === "QR_VERIFIED" || booking.status === "IN_PROGRESS" ? (
        <View style={s.card}>
          <Btn title="SOS — I need help" onPress={sos} kind="danger" />
        </View>
      ) : null}
      {booking.status === "OFFERED" || booking.status === "COUNTERED" ? (
        <View style={s.gap}>
          <Btn title="Cancel offer" onPress={() => act("cancel")} kind="danger" />
        </View>
      ) : null}
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
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    elevation: 2,
  },
  status: { fontSize: 20, fontWeight: "900" },
  meta: { fontSize: 14, color: "#333", marginTop: 4 },
  dname: { fontSize: 17, fontWeight: "800", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#E4E1D8",
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  gap: { marginTop: 10 },
  msg: { marginTop: 10, fontWeight: "700", color: "#E02020" },
});
