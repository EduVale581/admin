"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <div style={{ width: 220, background: "#111", color: "#fff", padding: 20 }}>
      <h3>EJEMPLO</h3>

      <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Link href="/dashboard/requests">Solicitudes</Link>
        <Link href="/dashboard/services">Servicios</Link>
        <Link href="/dashboard/payments">Pagos Webpay</Link>
        <Link href="/dashboard/providers">Pagos Prestadores</Link>
        <Link href="/dashboard/commissions">Comisiones</Link>
      </nav>
    </div>
  );
}
