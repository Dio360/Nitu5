import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { api, naira } from "@/api";
import { Btn } from "@/components/Btn";

interface Entry {
  id: string;
  type: string;
  debitKobo: number;
  creditKobo: number;
  createdAt: string;
}

/** Money home: balance, top-ups, earnings, every move. */
export default function Payments(): React.JSX.Element {
  const [balance, setBalance] = useState<number | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [earn, setEarn] = useState<{ driving: { netKobo: number }; riding: { spentKobo: number } } | null>(null);
  const [topup, setTopup] = useState("");
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    try {
      const w = await api<{ balanceKobo: number; entries: Entry[] }>("/wallet/mine");
      setBalance(w.balanceKobo);
      setEntries(w.entries);
    } catch {
      setBalance(null);
    }
    try {
      setEarn(await api<{ driving: { netKobo: number }; riding: { spentKobo: number } }>("/earnings/me"));
    } catch {
      setEarn(null);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const addMoney = async (): Promise<void> => {
    setMsg("");
    try {
      const res = await api<{ balanceKobo: number }>("/wallet/topup", {
        method: "POST",
        body: JSON.stringify({ amountKobo: Math.round(Number(topup) * 100) }),
      });
      setBalance(res.balanceKobo);
      setTopup("");
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed");
    }
  };

  return (
    <FlatList
      style={s.wrap}
      contentContainerStyle={s.content}
      data={entries}
      keyExtractor={(e) => e.id}
      ListHeaderComponent={
        <>
          <View style={s.big}>
            <Text style={s.amount}>{balance == null ? "…" : naira(balance)}</Text>
            <Text style={s.meta}>Wallet balance</Text>
          </View>
          <View style={s.card}>
            <TextInput
              style={s.input}
              placeholder="Top up amount, ₦"
              value={topup}
              onChangeText={setTopup}
              keyboardType="number-pad"
            />
            <Btn title="Add test money" onPress={addMoney} kind="green" />
            {earn && (
              <Text style={s.meta}>
                Earned driving {naira(earn.driving.netKobo)} · Spent riding {naira(earn.riding.spentKobo)}
              </Text>
            )}
            {msg ? <Text style={s.msg}>{msg}</Text> : null}
          </View>
          <Text style={s.dname}>Money moves</Text>
        </>
      }
      ListEmptyComponent={<Text style={s.empty}>No moves yet.</Text>}
      renderItem={({ item }) => (
        <View style={s.card}>
          <Text style={s.title}>
            {item.creditKobo > 0 ? `+${naira(item.creditKobo)}` : `−${naira(item.debitKobo)}`} · {prettyType(item.type)}
          </Text>
          <Text style={s.meta}>{new Date(item.createdAt).toLocaleString()}</Text>
        </View>
      )}
    />
  );
}

const prettyType = (t: string): string =>
  ({ HOLD: "Held for a ride", RELEASE: "Refunded", PAYOUT: "Paid out", FARE: "Ride fare", FEE: "Nitu5 fee" })[t] ?? t;

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#F3F1EE" },
  content: { padding: 16, paddingBottom: 40 },
  big: {
    backgroundColor: "#11190C",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  amount: { color: "#fff", fontSize: 34, fontWeight: "900" },
  meta: { fontSize: 13, color: "#787664", marginTop: 4 },
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
  title: { fontSize: 16, fontWeight: "800" },
  dname: { fontSize: 17, fontWeight: "800", marginVertical: 8 },
  empty: { textAlign: "center", color: "#787664", marginTop: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#CFCFCB",
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  msg: { marginTop: 8, fontWeight: "700", color: "#E02020" },
});
