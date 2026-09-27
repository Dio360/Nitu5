"use client";

import { useEffect, useState } from "react";
import { api, pretty } from "@/lib/api";

interface Report {
  id: string;
  category: string;
  severity: string;
  status: string;
  createdAt: string;
  reporter: { firstName: string; lastName: string; phone: string };
}

export default function Safety(): React.JSX.Element {
  const [rows, setRows] = useState<Report[]>([]);
  const load = async (): Promise<void> => {
    setRows(await api<Report[]>("/admin/safety"));
  };
  useEffect(() => {
    let live = true;
    api<Report[]>("/admin/safety")
      .then((d) => {
        if (live) setRows(d);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  const set = async (id: string, status: string): Promise<void> => {
    await api(`/admin/safety/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
    await load();
  };

  return (
    <>
      <h1 style={{ marginTop: 0 }}>Safety flags ({rows.length})</h1>
      {rows.map((r) => (
        <div
          key={r.id}
          style={{
            background: r.severity === "critical" ? "#FDE8E8" : "#fff",
            borderRadius: 12,
            padding: 14,
            marginBottom: 10,
          }}
        >
          <b>
            {r.severity === "critical" ? "🚨 " : ""}{pretty(r.category)}
          </b>{" "}
          · {r.severity} · {pretty(r.status)}
          <div style={{ color: "#666" }}>
            {r.reporter.firstName} {r.reporter.lastName} · {r.reporter.phone} ·{" "}
            {new Date(r.createdAt).toLocaleString()}
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            {(["REVIEWING", "RESOLVED", "DISMISSED"] as const).map((s) => (
              <button key={s} onClick={() => set(r.id, s)} style={btn}>
                {pretty(s)}
              </button>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

const btn: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "1px solid #ccc",
  background: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};
