"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, getToken, naira } from "@/lib/api";

interface Overview {
  users: number;
  trips: number;
  completedBookings: number;
  grossKobo: number;
  feesKobo: number;
  openDisputes: number;
  openSafety: number;
  openTickets: number;
}

export default function Home(): React.JSX.Element {
  const router = useRouter();
  const [o, setO] = useState<Overview | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }
    let live = true;
    api<Overview>("/admin/overview")
      .then((d) => {
        if (live) setO(d);
      })
      .catch(() => router.push("/login"));
    return () => {
      live = false;
    };
  }, [router]);

  if (!o) return <p>Loading…</p>;
  const cards: Array<[string, string, string]> = [
    ["People", String(o.users), "/users"],
    ["Trips", String(o.trips), "/trips"],
    ["Finished rides", String(o.completedBookings), "/trips"],
    ["Money moved", naira(o.grossKobo), "/trips"],
    ["Nitu5 fees", naira(o.feesKobo), "/trips"],
    ["Open disputes", String(o.openDisputes), "/disputes"],
    ["Safety flags", String(o.openSafety), "/safety"],
    ["Help tickets", String(o.openTickets), "/support"],
  ];
  return (
    <>
      <h1 style={{ marginTop: 0 }}>Today at Nitu5</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
        {cards.map(([label, value, href]) => (
          <a
            key={label}
            href={href}
            style={{ background: "#fff", borderRadius: 12, padding: 16, textDecoration: "none", color: "#111" }}
          >
            <div style={{ fontSize: 26, fontWeight: 900 }}>{value}</div>
            <div style={{ color: "#666" }}>{label}</div>
          </a>
        ))}
      </div>
    </>
  );
}
