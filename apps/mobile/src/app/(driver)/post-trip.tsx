import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { api } from "@/api";
import { Btn } from "@/components/Btn";

type Ride = "SHARED" | "PRIVATE";

export default function PostTrip(): React.JSX.Element {
  const [ride, setRide] = useState<Ride>("SHARED");
  const [origin, setOrigin] = useState("");
  const [dest, setDest] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [seats, setSeats] = useState("4");
  const [fare, setFare] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const post = async (): Promise<void> => {
    setBusy(true);
    setMsg("");
    try {
      const res = await api<{ id: string }>(`/trips`, {
        method: "POST",
        body: JSON.stringify({
          rideModel: ride,
          tripType: "SCHEDULED",
          originLabel: origin,
          destinationLabel: dest,
          departureAt: new Date(`${date}T${time}:00`).toISOString(),
          seatsTotal: Number(seats) || 1,
          ...(ride === "SHARED"
            ? { farePerSeatKobo: Math.round(Number(fare) * 100) }
            : { privateFareKobo: Math.round(Number(fare) * 100) }),
        }),
      });
      router.replace({ pathname: "/(driver)/trip/[id]", params: { id: res.id } });
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Could not post trip");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView style={s.wrap} contentContainerStyle={s.content}>
      <View style={s.row}>
        {(["SHARED", "PRIVATE"] as Ride[]).map((r) => (
          <TouchableOpacity key={r} style={[s.pick, ride === r && s.pickOn]} onPress={() => setRide(r)}>
            <Text style={s.picktxt}>{r === "SHARED" ? "Shared seats" : "Whole car"}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput style={s.input} placeholder="From, e.g. Lekki" value={origin} onChangeText={setOrigin} />
      <TextInput style={s.input} placeholder="To, e.g. Ikeja" value={dest} onChangeText={setDest} />
      <TextInput style={s.input} placeholder="Date YYYY-MM-DD" value={date} onChangeText={setDate} />
      <TextInput style={s.input} placeholder="Time HH:MM (24h)" value={time} onChangeText={setTime} />
      <TextInput style={s.input} placeholder="Seats" value={seats} onChangeText={setSeats} keyboardType="number-pad" />
      <TextInput
        style={s.input}
        placeholder={ride === "SHARED" ? "Price per seat, ₦" : "Whole-car price, ₦"}
        value={fare}
        onChangeText={setFare}
        keyboardType="number-pad"
      />
      <Btn title={busy ? "Posting…" : "Post trip"} onPress={post} disabled={busy} kind="green" />
      {msg ? <Text style={s.msg}>{msg}</Text> : null}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#F3F1EE" },
  content: { padding: 16, paddingBottom: 40 },
  row: { flexDirection: "row", gap: 8, marginBottom: 12 },
  pick: { flex: 1, borderWidth: 2, borderColor: "#000", borderRadius: 12, padding: 12, alignItems: "center" },
  pickOn: { backgroundColor: "#FFC900" },
  picktxt: { fontWeight: "800" },
  input: {
    borderWidth: 1,
    borderColor: "#E4E1D8",
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  msg: { marginTop: 8, fontWeight: "700", color: "#E02020" },
});
