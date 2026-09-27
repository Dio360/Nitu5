import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Btn } from "@/components/Btn";

/** What can Nitu5 do for you? One tap per service. */
export default function Services(): React.JSX.Element {
  return (
    <ScrollView style={s.wrap} contentContainerStyle={s.content}>
      <TouchableOpacity style={s.card} onPress={() => router.push("/(rider)/index")}>
        <Text style={s.title}>🤝 Shared ride</Text>
        <Text style={s.meta}>Split seats and cost with people going your way.</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.card} onPress={() => router.push("/(rider)/index")}>
        <Text style={s.title}>🔒 Private ride</Text>
        <Text style={s.meta}>The whole car, just for you.</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.card} onPress={() => router.push("/(rider)/activity")}>
        <Text style={s.title}>🧾 My trips</Text>
        <Text style={s.meta}>Offers, confirmed rides, price history.</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.card} onPress={() => router.push("/(driver)/index")}>
        <Text style={s.title}>💰 Drive & earn</Text>
        <Text style={s.meta}>Post trips, fill seats, get paid.</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.card} onPress={() => router.push("/support")}>
        <Text style={s.title}>🆘 Help & lost items</Text>
        <Text style={s.meta}>Talk to support, report lost things.</Text>
      </TouchableOpacity>
      <View style={s.gap}>
        <Btn title="Find a ride now" onPress={() => router.push("/(rider)/index")} />
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#F3F1EE" },
  content: { padding: 16, paddingBottom: 40 },
  gap: { marginTop: 8 },
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
  title: { fontSize: 19, fontWeight: "900" },
  meta: { fontSize: 13, color: "#787664", marginTop: 4 },
});
