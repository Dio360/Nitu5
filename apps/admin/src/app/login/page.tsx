"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, setToken } from "@/lib/api";

export default function Login(): React.JSX.Element {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const go = async (): Promise<void> => {
    setError("");
    try {
      const res = await api<{ accessToken: string; user: { role: string } }>("/auth/otp/verify", {
        method: "POST",
        body: JSON.stringify({ phone, code }),
      });
      if (res.user.role !== "ADMIN" && res.user.role !== "SUPPORT") {
        setError("This account is not staff.");
        return;
      }
      setToken(res.accessToken);
      router.push("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "80px auto", background: "#fff", padding: 24, borderRadius: 16 }}>
      <h1 style={{ margin: 0 }}>Nitu5 Admin</h1>
      <p style={{ color: "#666" }}>Staff only. Dev code: 000000.</p>
      <input
        placeholder="Phone, e.g. +234..."
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={input}
      />
      <input
        placeholder="Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={input}
      />
      <button onClick={go} style={btn}>
        Log in
      </button>
      {error ? <p style={{ color: "red" }}>{error}</p> : null}
    </div>
  );
}

const input: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: 10,
  marginBottom: 10,
  borderRadius: 8,
  border: "1px solid #ccc",
  fontSize: 15,
};

const btn: React.CSSProperties = {
  width: "100%",
  padding: 12,
  borderRadius: 8,
  border: 0,
  background: "#11190C",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};
