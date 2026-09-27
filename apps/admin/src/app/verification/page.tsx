"use client";

import { useEffect, useState } from "react";
import { api, pretty } from "@/lib/api";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  colour: string;
  plate: string;
  capacity: number;
  verificationStatus: string;
  driver: { firstName: string; lastName: string; phone: string };
}

export default function Cars(): React.JSX.Element {
  const [rows, setRows] = useState<Vehicle[]>([]);
  const load = async (): Promise<void> => {
    setRows(await api<Vehicle[]>("/admin/vehicles?status=PENDING"));
  };
  useEffect(() => {
    let live = true;
    api<Vehicle[]>("/admin/vehicles?status=PENDING")
      .then((d) => {
        if (live) setRows(d);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  const decide = async (id: string, status: string): Promise<void> => {
    await api(`/admin/vehicles/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
    await load();
  };

  return (
    <>
      <h1 style={{ marginTop: 0 }}>Cars waiting ({rows.length})</h1>
      {rows.map((v) => (
        <div key={v.id} style={card}>
          <b>
            {v.make} {v.model} · {v.plate}
          </b>{" "}
          · {v.colour} · {v.capacity} seats
          <div style={{ color: "#666" }}>
            {v.driver.firstName} {v.driver.lastName} · {v.driver.phone} · {pretty(v.verificationStatus)}
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <button onClick={() => decide(v.id, "VERIFIED")} style={ok}>
              Approve
            </button>
            <button onClick={() => decide(v.id, "REJECTED")} style={no}>
              Reject
            </button>
          </div>
        </div>
      ))}
      {rows.length === 0 ? <p>Queue clear. 🎉</p> : null}
    </>
  );
}

const card: React.CSSProperties = { background: "#fff", borderRadius: 12, padding: 14, marginBottom: 10 };
const ok: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: 8,
  border: 0,
  background: "#34BB78",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};
const no: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: 8,
  border: 0,
  background: "#E02020",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};
