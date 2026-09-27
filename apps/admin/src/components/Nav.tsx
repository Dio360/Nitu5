"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearToken } from "@/lib/api";

const LINKS = [
  ["Overview", "/"],
  ["Users", "/users"],
  ["Cars", "/verification"],
  ["Trips", "/trips"],
  ["Disputes", "/disputes"],
  ["Safety", "/safety"],
  ["Support", "/support"],
] as const;

export default function Nav(): React.JSX.Element | null {
  const path = usePathname();
  const router = useRouter();
  if (path === "/login") return null;
  return (
    <nav
      style={{
        display: "flex",
        gap: 4,
        padding: "10px 16px",
        background: "#11190C",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <span style={{ color: "#fff", fontWeight: 900, marginRight: 12 }}>Nitu5 Admin</span>
      {LINKS.map(([label, href]) => (
        <Link
          key={href}
          href={href}
          style={{
            color: path === href ? "#11190C" : "#fff",
            background: path === href ? "#FFC900" : "transparent",
            padding: "6px 12px",
            borderRadius: 8,
            fontWeight: 700,
            textDecoration: "none",
            fontSize: 14,
          }}
        >
          {label}
        </Link>
      ))}
      <button
        onClick={() => {
          clearToken();
          router.push("/login");
        }}
        style={{
          marginLeft: "auto",
          background: "transparent",
          color: "#fff",
          border: "1px solid #555",
          borderRadius: 8,
          padding: "6px 12px",
          cursor: "pointer",
        }}
      >
        Log out
      </button>
    </nav>
  );
}
