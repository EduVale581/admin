"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Table from "@/components/Table";
import { Payment } from "@/lib/types";

export default function PaymentsPage() {
  const [data, setData] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.get("/api/payments");
      setData(result);
    } catch (err) {
      setError("Error al cargar los pagos.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const total = data.reduce((sum, p) => sum + p.amount, 0);
  const pagados = data.filter((p) => p.status === "paid").length;
  const pendientes = data.filter((p) => p.status === "pending").length;

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto", fontFamily: "sans-serif" }}>

      <h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.25rem" }}>
        Historial de pagos
      </h1>
      <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
        Lista de todos los pagos registrados en el sistema.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={cardStyle}>
          <div style={labelStyle}>Total pagos</div>
          <div style={valueStyle}>{data.length}</div>
        </div>
        <div style={cardStyle}>
          <div style={labelStyle}>Monto total</div>
          <div style={{ ...valueStyle, color: "#065f46" }}>${total.toLocaleString("es-CL")}</div>
        </div>
        <div style={cardStyle}>
          <div style={labelStyle}>Pagados</div>
          <div style={{ ...valueStyle, color: "#065f46" }}>{pagados}</div>
        </div>
        <div style={cardStyle}>
          <div style={labelStyle}>Pendientes</div>
          <div style={{ ...valueStyle, color: "#92400e" }}>{pendientes}</div>
        </div>
      </div>

      {loading && <p style={{ color: "#6b7280" }}>Cargando pagos...</p>}
      {error && <p style={{ color: "#991b1b" }}>{error}</p>}

      {!loading && !error && <Table data={data} />}
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
  padding: "1rem",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  color: "#6b7280",
  marginBottom: "0.25rem",
};

const valueStyle: React.CSSProperties = {
  fontSize: "1.25rem",
  fontWeight: 600,
};