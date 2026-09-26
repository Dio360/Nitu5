import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { api } from "@/api";
import { useAuth } from "@/auth";

export default function Login(): React.JSX.Element {
  const { login } = useAuth();
  const [phone, setPhone] = useState("+234");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const requestCode = async (): Promise<void> => {
    setBusy(true);
    setError("");
    try {
      await api("/auth/otp/request", { method: "POST", body: JSON.stringify({ phone }) });
      setStep("code");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not send code");
    } finally {
      setBusy(false);
    }
  };

  const confirmCode = async (): Promise<void> => {
    setBusy(true);
    setError("");
    try {
      await login(phone, code);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Wrong code");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={s.wrap}>
      <Text style={s.title}>Nitu5</Text>
      <Text style={s.sub}>Move together. Pay fairly. Travel safely.</Text>
      {step === "phone" ? (
        <>
          <Text style={s.label}>Phone number</Text>
          <TextInput style={s.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <Button title={busy ? "Sending…" : "Send code"} onPress={requestCode} disabled={busy} />
        </>
      ) : (
        <>
          <Text style={s.label}>Code sent to {phone} (dev? use 000000)</Text>
          <TextInput
            style={s.input}
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
          />
          <Button title={busy ? "Checking…" : "Log in"} onPress={confirmCode} disabled={busy} />
        </>
      )}
      {error ? <Text style={s.error}>{error}</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, padding: 24, justifyContent: "center", backgroundColor: "#FFF9EF" },
  title: { fontSize: 40, fontWeight: "900" },
  sub: { fontSize: 15, color: "#5A6B87", marginBottom: 28 },
  label: { fontSize: 14, fontWeight: "700", marginBottom: 8 },
  input: {
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 12,
    padding: 12,
    fontSize: 17,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  error: { color: "#E02020", marginTop: 12, fontWeight: "700" },
});
