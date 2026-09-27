"use client";

import { useState } from "react";
import { api, pretty } from "@/lib/api";

interface User {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: string;
  verificationTier: string;
  rating: number | null;
  tripsCompleted: number;
}

export default function Users(): React.JSX.Element {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<User[]>([]);

  const search = async (): Promise<void> => {
    setRows(await api<User[]>(`/admin/users?search=${encodeURIComponent(q)}`));
  };

  const set = async (id: string, patch: object): Promise<void> => {
    await api(`/admin/users/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
    await search();
  };

  return (
    <>
      <h1 style={{ marginTop: 0 }}>People</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          placeholder="Search phone or name"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <button onClick={search} style={btn}>
          Search
        </button>
      </div>
      {rows.map((u) => (
        <div key={u.id} style={card}>
          <b>
            {u.firstName} {u.lastName}
          </b>{" "}
          · {u.phone} · ⭐ {u.rating ?? "new"} · {u.tripsCompleted} trips
          <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <select value={u.role} onChange={(e) => set(u.id, { role: e.target.value })} style={sel}>
              {["RIDER", "PRIVATE_DRIVER", "PROFESSIONAL_DRIVER", "ADMIN", "SUPPORT"].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <select
              value={u.verificationTier}
              onChange={(e) => set(u.id, { verificationTier: e.target.value })}
              style={sel}
            >
              {["L0_NONE", "L1_ACCOUNT", "L2_IDENTITY", "L3_DRIVER_VEHICLE", "L4_FULLY_VERIFIED"].map((t) => (
                <option key={t} value={t}>
                  {pretty(t)}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </>
  );
}

const card: React.CSSProperties = { background: "#fff", borderRadius: 12, padding: 14, marginBottom: 10 };
const sel: React.CSSProperties = { padding: 8, borderRadius: 8 };
const btn: React.CSSProperties = {
  padding: "10px 18px",
  borderRadius: 8,
  border: 0,
  background: "#11190C",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};
