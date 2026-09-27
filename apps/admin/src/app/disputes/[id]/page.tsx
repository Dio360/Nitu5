"use client";

import { use, useEffect, useState } from "react";
import { api, naira, pretty } from "@/lib/api";

interface CaseFile {
  dispute: { id: string; type: string; status: string; evidence: { notes?: string[]; decision?: string } | null };
  negotiations: Array<{ action: string; amountKobo: number; createdAt: string }>;
  qrAttempts: Array<{ createdAt: string }>;
  safetyReports: Array<{ category: string; severity: string }>;
}

export default function DisputeCase({ params }: { params: Promise<{ id: string }> }): React.JSX.Element {
  const { id } = use(params);
  const [c, setC] = useState<CaseFile | null>(null);
  const [decision, setDecision] = useState("");

  const load = async (): Promise<void> => {
    setC(await api<CaseFile>(`/admin/disputes/${id}`));
  };
  useEffect(() => {
    let live = true;
    api<CaseFile>(`/admin/disputes/${id}`)
      .then((d) => {
        if (live) setC(d);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [id]);

  const decide = async (status: "DECIDED" | "CLOSED"): Promise<void> => {
    await api(`/admin/disputes/${id}/decide`, { method: "PATCH", body: JSON.stringify({ decision, status }) });
    await load();
  };

  if (!c) return <p>Loading…</p>;
  return (
    <>
      <h1 style={{ marginTop: 0 }}>
        {pretty(c.dispute.type)} · {pretty(c.dispute.status)}
      </h1>
      <div style={card}>
        <b>Price talks ({c.negotiations.length})</b>
        {c.negotiations.map((n, i) => (
          <div key={i} style={dim}>
            {pretty(n.action)} · {naira(n.amountKobo)} · {new Date(n.createdAt).toLocaleString()}
          </div>
        ))}
      </div>
      <div style={card}>
        <b>QR scans ({c.qrAttempts.length})</b> · <b>Safety flags ({c.safetyReports.length})</b>
        {c.safetyReports.map((s, i) => (
          <div key={i} style={dim}>
            {pretty(s.category)} · {s.severity}
          </div>
        ))}
      </div>
      <div style={card}>
        <b>Notes</b>
        {(c.dispute.evidence?.notes ?? []).map((n, i) => (
          <div key={i} style={dim}>
            {n}
          </div>
        ))}
        {c.dispute.evidence?.decision ? <div style={dim}>Decision: {c.dispute.evidence.decision}</div> : null}
      </div>
      <div style={card}>
        <b>Decide</b>
        <textarea
          placeholder="Write the decision…"
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
          style={{ width: "100%", boxSizing: "border-box", padding: 10, borderRadius: 8, border: "1px solid #ccc", minHeight: 80, marginTop: 8 }}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button onClick={() => decide("DECIDED")} style={ok}>
            Decide
          </button>
          <button onClick={() => decide("CLOSED")} style={ghost}>
            Close
          </button>
        </div>
      </div>
    </>
  );
}

const card: React.CSSProperties = { background: "#fff", borderRadius: 12, padding: 14, marginBottom: 10 };
const dim: React.CSSProperties = { color: "#555", marginTop: 4 };
const ok: React.CSSProperties = {
  padding: "10px 18px",
  borderRadius: 8,
  border: 0,
  background: "#34BB78",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};
const ghost: React.CSSProperties = {
  padding: "10px 18px",
  borderRadius: 8,
  border: "1px solid #ccc",
  background: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};
