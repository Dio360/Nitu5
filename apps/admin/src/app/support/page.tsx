"use client";

import { useEffect, useState } from "react";
import { api, pretty } from "@/lib/api";

interface Ticket {
  id: string;
  category: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  user: { firstName: string; lastName: string; phone: string };
}

export default function Support(): React.JSX.Element {
  const [rows, setRows] = useState<Ticket[]>([]);
  const load = async (): Promise<void> => {
    setRows(await api<Ticket[]>("/admin/support"));
  };
  useEffect(() => {
    let live = true;
    api<Ticket[]>("/admin/support")
      .then((d) => {
        if (live) setRows(d);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  const set = async (id: string, status: string): Promise<void> => {
    await api(`/admin/support/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
    await load();
  };

  return (
    <>
      <h1 style={{ marginTop: 0 }}>Help tickets ({rows.length})</h1>
      {rows.map((t) => (
        <div key={t.id} style={card}>
          <b>{t.subject}</b> · {pretty(t.category)} · {pretty(t.status)}
          <div style={{ color: "#666" }}>
            {t.user.firstName} {t.user.lastName} · {t.user.phone} · {new Date(t.createdAt).toLocaleString()}
          </div>
          <div style={{ marginTop: 4 }}>{t.message}</div>
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            {(["IN_PROGRESS", "RESOLVED"] as const).map((s) => (
              <button key={s} onClick={() => set(t.id, s)} style={btn}>
                {pretty(s)}
              </button>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

const card: React.CSSProperties = { background: "#fff", borderRadius: 12, padding: 14, marginBottom: 10 };
const btn: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "1px solid #ccc",
  background: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};
