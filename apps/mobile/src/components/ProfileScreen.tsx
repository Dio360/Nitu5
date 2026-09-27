import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { User, api, naira } from "@/api";
import { useAuth } from "@/auth";
import { Btn } from "@/components/Btn";

export default function Profile(): React.JSX.Element {
  const { user, login, logout, reload } = useAuth();
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [topup, setTopup] = useState("");
  const [wallet, setWallet] = useState<number | null>(null);
  const [earn, setEarn] = useState<{ driving: { netKobo: number }; riding: { spentKobo: number } } | null>(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    await reload().catch(() => {});
    try {
      const w = await api<{ balanceKobo: number }>("/wallet/mine");
      setWallet(w.balanceKobo);
    } catch {
      setWallet(null);
    }
    try {
      setEarn(await api<{ driving: { netKobo: number }; riding: { spentKobo: number } }>("/earnings/me"));
    } catch {
      setEarn(null);
    }
  }, [reload]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const me: User | null = user;

  const saveName = async (): Promise<void> => {
    setMsg("");
    try {
      await api("/me", { method: "PATCH", body: JSON.stringify({ firstName: first || undefined, lastName: last || undefined }) });
      setFirst("");
      setLast("");
      await reload();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed");
    }
  };

  const switchRole = async (role: "RIDER" | "PRIVATE_DRIVER"): Promise<void> => {
    setMsg("");
    try {
      if (!me) return;
      await api("/me", { method: "PATCH", body: JSON.stringify({ role }) });
      await login(me.phone, "000000"); // fresh login so the app sees the new role
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

  const addMoney = async (): Promise<void> => {
    setMsg("");
    try {
      const res = await api<{ balanceKobo: number }>("/wallet/topup", {
        method: "POST",
        body: JSON.stringify({ amountKobo: Math.round(Number(topup) * 100) }),
      });
      setWallet(res.balanceKobo);
      setTopup("");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed");
    }
  };

  return (
    <ScrollView style={s.wrap} contentContainerStyle={s.content}>
      <View style={s.card}>
        <Text style={s.title}>
          {me?.firstName} {me?.lastName}
        </Text>
        <Text style={s.meta}>{me?.phone}</Text>
        <Text style={s.meta}>
          {me?.role} · {me?.verificationTier} · ⭐ {me?.rating ?? "new"} · {me?.tripsCompleted} trips
        </Text>
      </View>

      <View style={s.card}>
        <Text style={s.dname}>Edit name</Text>
        <TextInput style={s.input} placeholder="First name" value={first} onChangeText={setFirst} />
        <TextInput style={s.input} placeholder="Last name" value={last} onChangeText={setLast} />
        <Btn title="Save name" onPress={saveName} kind="ghost" />
      </View>

      <View style={s.card}>
        <Text style={s.dname}>I am a…</Text>
        <Btn title="Rider" kind={me?.role === "RIDER" ? "dark" : "ghost"} onPress={() => switchRole("RIDER")} />
        <Btn title="Driver" kind={me?.role !== "RIDER" ? "dark" : "ghost"} onPress={() => switchRole("PRIVATE_DRIVER")} />
      </View>

      <View style={s.card}>
        <Text style={s.dname}>Verification</Text>
        <Btn title="Verify identity (L2)" onPress={() => verify("L2_IDENTITY")} kind="ghost" />
        <Btn title="Verify car (L3)" onPress={() => verify("L3_DRIVER_VEHICLE")} kind="ghost" />
      </View>

      <View style={s.card}>
        <Text style={s.dname}>Wallet: {wallet == null ? "…" : naira(wallet)}</Text>
        <TextInput style={s.input} placeholder="Top up amount, ₦" value={topup} onChangeText={setTopup} keyboardType="number-pad" />
        <Btn title="Add test money" onPress={addMoney} kind="pink" />
        {earn && (
          <Text style={s.meta}>
            Earned driving: {naira(earn.driving.netKobo)} · Spent riding: {naira(earn.riding.spentKobo)}
          </Text>
        )}
      </View>

      {msg ? <Text style={s.msg}>{msg}</Text> : null}
      <TouchableOpacity style={s.row} onPress={() => router.push("/(rider)/services")}>
        <Text style={s.rowtxt}>🧰 More services ›</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.row} onPress={() => router.push("/support")}>
        <Text style={s.rowtxt}>🆘 Help & lost items ›</Text>
      </TouchableOpacity>
      <Btn title="Log out" onPress={logout} kind="danger" />
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
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    elevation: 4,
  },
  title: { fontSize: 20, fontWeight: "900" },
  dname: { fontSize: 17, fontWeight: "800", marginBottom: 8 },
  meta: { fontSize: 13, color: "#6F6455", marginTop: 2 },
  input: {
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  msg: { fontWeight: "700", color: "#E02020", textAlign: "center", marginBottom: 8 },
  row: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  rowtxt: { fontSize: 16, fontWeight: "800" },
});
