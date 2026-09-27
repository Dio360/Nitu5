import React, { useCallback, useState } from "react";
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { api, naira } from "@/api";

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
}

export default function BookingDetails(): React.JSX.Element {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [msg, setMsg] = useState("");

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

  if (!booking) return <ActivityIndicator style={s.spin} size="large" />;

  return (
    <ScrollView style={s.wrap} contentContainerStyle={s.content}>
      <View style={s.card}>
        <Text style={s.status}>{booking.status}</Text>
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
            {st.action} · {naira(st.amountKobo)} · {new Date(st.createdAt).toLocaleTimeString()}
          </Text>
        ))}
      </View>
      {booking.status === "COUNTERED" ? <Button title="Accept counter" onPress={() => act("agree")} /> : null}
      {booking.status === "OFFERED" || booking.status === "COUNTERED" ? (
        <View style={s.gap}>
          <Button title="Cancel offer" onPress={() => act("cancel")} color="#E02020" />
        </View>
      ) : null}
      {msg ? <Text style={s.msg}>{msg}</Text> : null}
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
  status: { fontSize: 20, fontWeight: "900" },
  meta: { fontSize: 14, color: "#333", marginTop: 4 },
  dname: { fontSize: 17, fontWeight: "800", marginBottom: 6 },
  gap: { marginTop: 10 },
  msg: { marginTop: 10, fontWeight: "700", color: "#E02020" },
});
