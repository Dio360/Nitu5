import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { api, naira } from "@/api";

/** Driver home: money first, then trips and cars. */
export default function DriverHome(): React.JSX.Element {
  const [earn, setEarn] = useState<{ driving: { trips: number; netKobo: number } } | null>(null);
  const [wallet, setWallet] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const e = await api<{ driving: { trips: number; netKobo: number } }>("/earnings/me");
      setEarn(e);
      const w = await api<{ balanceKobo: number }>("/wallet/mine");
      setWallet(w.balanceKobo);
    } catch {
      setEarn(null);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <ScrollView style={s.wrap} contentContainerStyle={s.content}>
      <View style={s.card}>
        <Text style={s.big}>{earn == null ? "…" : naira(earn.driving.netKobo)}</Text>
        <Text style={s.meta}>Earned driving · {earn?.driving.trips ?? "…"} trips · Wallet {wallet == null ? "…" : naira(wallet)}</Text>
      </View>
      <TouchableOpacity style={s.card} onPress={() => router.push("/(driver)/trips")}>
        <Text style={s.title}>🚗 My trips</Text>
        <Text style={s.meta}>Post trips, see offers, run trip day.</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.card} onPress={() => router.push("/(driver)/cars")}>
        <Text style={s.title}>🔧 My cars</Text>
        <Text style={s.meta}>Add and manage your vehicles.</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#FFF9EF" },
  content: { padding: 16, paddingBottom: 40 },
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
  big: { fontSize: 34, fontWeight: "900" },
  title: { fontSize: 19, fontWeight: "900" },
  meta: { fontSize: 13, color: "#6F6455", marginTop: 4 },
});
