"use client";

import { useEffect, useState } from "react";
import { api, naira, pretty } from "@/lib/api";

interface Trip {
  id: string;
  originLabel: string;
  destinationLabel: string;
  departureAt: string;
  status: string;
  seatsTotal: number;
  seatsBooked: number;
  farePerSeatKobo: number | null;
  driver: { firstName: string; lastName: string; phone: string };
  _count: { bookings: number };
}

export default function Trips(): React.JSX.Element {
  const [rows, setRows] = useState<Trip[]>([]);
  useEffect(() => {
    let live = true;
    api<Trip[]>("/admin/trips")
      .then((d) => {
        if (live) setRows(d);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  return (
    <>
      <h1 style={{ marginTop: 0 }}>Trips ({rows.length})</h1>
      {rows.map((t) => (
        <div key={t.id} style={card}>
          <b>
            {t.originLabel} → {t.destinationLabel}
          </b>{" "}
          · {pretty(t.status)}
          <div style={{ color: "#666" }}>
            {new Date(t.departureAt).toLocaleString()} · {t.seatsBooked}/{t.seatsTotal} seats ·{" "}
            {naira(t.farePerSeatKobo)}/seat · {t._count.bookings} bookings
          </div>
          <div style={{ color: "#666" }}>
            {t.driver.firstName} {t.driver.lastName} · {t.driver.phone}
          </div>
        </div>
      ))}
    </>
  );
}

const card: React.CSSProperties = { background: "#fff", borderRadius: 12, padding: 14, marginBottom: 10 };
