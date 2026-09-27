import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { User, api } from "@/api";
import { pretty } from "@/theme";
import { useAuth } from "@/auth";
import { Btn } from "@/components/Btn";

/** Bolt-style account: who I am, my money, my car papers, how to earn. */
export default function Profile(): React.JSX.Element {
  const { user, login, logout, reload } = useAuth();
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(() => {
    reload().catch(() => {});
  }, [reload]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const me: User | null = user;
  const isDriver = me?.role !== "RIDER";

  const saveName = async (): Promise<void> => {
    setMsg("");
    try {
      await api("/me", {
        method: "PATCH",
        body: JSON.stringify({ firstName: first || undefined, lastName: last || undefined }),
      });
      setFirst("");
      setLast("");
      setEditing(false);
      await reload();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed");
    }
  };

  const becomeDriver = async (): Promise<void> => {
    setMsg("");
    try {
      if (!me) return;
      await api("/me", { method: "PATCH", body: JSON.stringify({ role: "PRIVATE_DRIVER" }) });
      await login(me.phone, "000000"); // fresh login so the app sees the new role
      router.replace("/(driver)");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed");
    }
  };

  const verify = async (level: "L2_IDENTITY" | "L3_DRIVER_VEHICLE"): Promise<void> => {
    setMsg("");
    try {
      await api("/verification/submit", { method: "POST", body: JSON.stringify({ level }) });
      await reload();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed");
    }
  };

  const row = (emoji: string, label: string, sub: string, go: () => void): React.JSX.Element => (
    <TouchableOpacity style={s.row} onPress={go}>
      <Text style={s.rowemoji}>{emoji}</Text>
      <View style={s.rowbody}>
        <Text style={s.rowtxt}>{label}</Text>
        <Text style={s.rowsub}>{sub}</Text>
      </View>
      <Text style={s.rowarrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={s.wrap} contentContainerStyle={s.content}>
      <View style={s.head}>
        <View style={s.avatar}>
          <Text style={s.avatarTxt}>{(me?.firstName?.[0] ?? "?").toUpperCase()}</Text>
        </View>
        <View style={s.headbody}>
          <Text style={s.name}>
            {me?.firstName} {me?.lastName}
          </Text>
          <Text style={s.meta}>{me?.phone}</Text>
          <Text style={s.meta}>
            ⭐ {me?.rating ?? "new"} · {me?.tripsCompleted} trips · {pretty(me?.verificationTier)}
          </Text>
        </View>
        <TouchableOpacity onPress={() => setEditing((v) => !v)}>
          <Text style={s.edit}>Edit</Text>
        </TouchableOpacity>
      </View>

      {editing ? (
        <View style={s.card}>
          <TextInput style={s.input} placeholder="First name" value={first} onChangeText={setFirst} />
          <TextInput style={s.input} placeholder="Last name" value={last} onChangeText={setLast} />
          <Btn title="Save" onPress={saveName} kind="ghost" />
        </View>
      ) : null}

      {row("💳", "Payments", "Wallet, top-ups, earnings", () => router.push("/payments"))}
      {row("🛡", "Verification", pretty(me?.verificationTier), () => {})}
      <View style={s.card}>
        <Btn title="Verify my ID" onPress={() => verify("L2_IDENTITY")} kind="ghost" />
        <Btn title="Verify my car" onPress={() => verify("L3_DRIVER_VEHICLE")} kind="ghost" />
      </View>
      {row("🧰", "Services", "Rides, help, more", () => router.push("/(rider)/services"))}
      {row("🆘", "Help & lost items", "Talk to support", () => router.push("/support"))}
      {isDriver
        ? row("🚗", "Nitu5 Driver", "Open Drive & Earn", () => router.push("/(driver)"))
        : row("💰", "Earn with Nitu5", "Become a driver", becomeDriver)}

      {msg ? <Text style={s.msg}>{msg}</Text> : null}
      <Btn title="Log out" onPress={logout} kind="danger" />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#F3F1EE" },
  content: { padding: 16, paddingBottom: 40 },
  head: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#11190C",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTxt: { color: "#fff", fontSize: 24, fontWeight: "900" },
  headbody: { flex: 1, marginLeft: 12 },
  name: { fontSize: 20, fontWeight: "900" },
  meta: { fontSize: 13, color: "#787664", marginTop: 2 },
  edit: { fontWeight: "800", fontSize: 15 },
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E4E1D8",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  rowemoji: { fontSize: 24 },
  rowbody: { flex: 1, marginLeft: 12 },
  rowtxt: { fontSize: 16, fontWeight: "800" },
  rowsub: { fontSize: 13, color: "#787664", marginTop: 2 },
  rowarrow: { fontSize: 22, color: "#787664", fontWeight: "800" },
  input: {
    borderWidth: 1,
    borderColor: "#CFCFCB",
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  msg: { fontWeight: "700", color: "#E02020", textAlign: "center", marginBottom: 8 },
});
