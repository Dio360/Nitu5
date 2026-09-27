import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { api } from "@/api";
import { pretty } from "@/theme";
import { Btn } from "@/components/Btn";

interface Car {
  id: string;
  make: string;
  model: string;
  colour: string;
  plate: string;
  category: string;
  capacity: number;
  verificationStatus: string;
}

export default function Cars(): React.JSX.Element {
  const [cars, setCars] = useState<Car[]>([]);
  const [form, setForm] = useState({ make: "", model: "", colour: "", plate: "", category: "Sedan", seats: "4" });
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    try {
      setCars(await api<Car[]>("/me/vehicles"));
    } catch {
      setCars([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const add = async (): Promise<void> => {
    setMsg("");
    try {
      await api("/me/vehicles", {
        method: "POST",
        body: JSON.stringify({
          make: form.make,
          model: form.model,
          colour: form.colour,
          plate: form.plate,
          category: form.category,
          seats: Number(form.seats) || 4,
        }),
      });
      setForm({ make: "", model: "", colour: "", plate: "", category: "Sedan", seats: "4" });
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Could not add car");
    }
  };

  return (
    <FlatList
      style={s.wrap}
      contentContainerStyle={s.content}
      data={cars}
      keyExtractor={(c) => c.id}
      ListHeaderComponent={
        <View style={s.card}>
          <Text style={s.title}>Add your car</Text>
          {(["make", "model", "colour", "plate"] as const).map((k) => (
            <TextInput key={k} style={s.input} placeholder={k[0].toUpperCase() + k.slice(1)} value={form[k]} onChangeText={set(k)} />
          ))}
          <TextInput style={s.input} placeholder="Seats" value={form.seats} onChangeText={set("seats")} keyboardType="number-pad" />
          <Btn title="Add car" onPress={add} kind="green" />
          {msg ? <Text style={s.msg}>{msg}</Text> : null}
        </View>
      }
      ListEmptyComponent={<Text style={s.empty}>No cars yet.</Text>}
      renderItem={({ item }) => (
        <View style={s.card}>
          <Text style={s.title}>
            {item.make} {item.model} · {item.plate}
          </Text>
          <Text style={s.meta}>
            {item.colour} · {item.capacity} seats · {pretty(item.verificationStatus)}
          </Text>
        </View>
      )}
    />
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#F3F1EE" },
  content: { padding: 16, paddingBottom: 40 },
  empty: { textAlign: "center", color: "#787664", marginTop: 16 },
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
  title: { fontSize: 17, fontWeight: "800", marginBottom: 8 },
  meta: { fontSize: 13, color: "#787664", marginTop: 2 },
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
