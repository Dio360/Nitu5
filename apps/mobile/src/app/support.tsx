import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { api } from "@/api";
import { Btn } from "@/components/Btn";

interface Ticket {
  id: string;
  category: string;
  subject: string;
  status: string;
  createdAt: string;
}

export default function Support(): React.JSX.Element {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    try {
      setTickets(await api<Ticket[]>("/support/tickets/mine"));
    } catch {
      setTickets([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const open = async (): Promise<void> => {
    setMsg("");
    try {
      await api("/support/tickets", {
        method: "POST",
        body: JSON.stringify({ category: "HELP", subject, message }),
      });
      setSubject("");
      setMessage("");
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed");
    }
  };

  return (
    <FlatList
      style={s.wrap}
      contentContainerStyle={s.content}
      data={tickets}
      keyExtractor={(t) => t.id}
      ListHeaderComponent={
        <View style={s.card}>
          <Text style={s.title}>🆘 Ask for help</Text>
          <TextInput style={s.input} placeholder="Subject" value={subject} onChangeText={setSubject} />
          <TextInput
            style={[s.input, s.area]}
            placeholder="What happened?"
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <Btn title="Send to support" onPress={open} />
          {msg ? <Text style={s.msg}>{msg}</Text> : null}
        </View>
      }
      ListEmptyComponent={<Text style={s.empty}>No tickets yet.</Text>}
      renderItem={({ item }) => (
        <View style={s.card}>
          <Text style={s.title}>{item.subject}</Text>
          <Text style={s.meta}>
            {item.category} · {item.status} · {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      )}
    />
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#FFF9EF" },
  content: { padding: 16, paddingBottom: 40 },
  empty: { textAlign: "center", color: "#6F6455", marginTop: 16 },
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
  title: { fontSize: 17, fontWeight: "800", marginBottom: 8 },
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
  area: { minHeight: 90, textAlignVertical: "top" },
  msg: { marginTop: 8, fontWeight: "700", color: "#E02020" },
});
