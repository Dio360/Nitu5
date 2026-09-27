"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, naira, pretty } from "@/lib/api";

interface Dispute {
  id: string;
  type: string;
  status: string;
  createdAt: string;
  booking: { offeredFareKobo: number; agreedFareKobo: number | null; status: string };
}

export default function Disputes(): React.JSX.Element {
  const [rows, setRows] = useState<Dispute[]>([]);
  useEffect(() => {
    let live = true;
    api<Dispute[]>("/admin/disputes")
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
      <h1 style={{ marginTop: 0 }}>Disputes ({rows.length})</h1>
      {rows.map((d) => (
        <Link
          key={d.id}
          href={`/disputes/${d.id}`}
          style={{ display: "block", background: "#fff", borderRadius: 12, padding: 14, marginBottom: 10, color: "#111", textDecoration: "none" }}
        >
          <b>{pretty(d.type)}</b> · {pretty(d.status)} · {new Date(d.createdAt).toLocaleString()}
          <div style={{ color: "#666" }}>
            Offered {naira(d.booking.offeredFareKobo)}
            {d.booking.agreedFareKobo != null ? ` · agreed ${naira(d.booking.agreedFareKobo)}` : ""} · booking{" "}
            {pretty(d.booking.status)}
          </div>
        </Link>
      ))}
    </>
  );
}
