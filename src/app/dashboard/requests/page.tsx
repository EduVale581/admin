"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Card from "@/components/Card";

interface Company {
  id: string;
  nombre: string;
  fecha: string;
  estado: "pending" | "active" | "completed";
}

export default function RequestsPage() {
  const [data, setData] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await api.get("/api/requests");
        if (Array.isArray(result)) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching requests:", err);
        setError("Error al cargar solicitudes");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#4caf50";
      case "completed":
        return "#2196f3";
      case "pending":
        return "#ff9800";
      default:
        return "#9e9e9e";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Activo";
      case "completed":
        return "Completado";
      case "pending":
        return "Pendiente";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("es-MX", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Card title="Solicitudes de Empresa">
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && data.length === 0 && <p>Sin datos disponibles</p>}
      {!loading && data.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "10px",
          }}
        >
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "2px solid #eee" }}>
              <th style={{ padding: "10px" }}>Nombre</th>
              <th style={{ padding: "10px" }}>Fecha</th>
              <th style={{ padding: "10px" }}>Estado</th>
              <th style={{ padding: "10px" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((company) => (
              <tr key={company.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "10px" }}>{company.nombre}</td>
                <td style={{ padding: "10px" }}>{formatDate(company.fecha)}</td>
                <td style={{ padding: "10px" }}>
                  <span
                    style={{
                      backgroundColor: getStatusColor(company.estado),
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "500",
                    }}
                  >
                    {getStatusLabel(company.estado)}
                  </span>
                </td>
                <td style={{ padding: "10px" }}>
                  {/* Botones se agregarán aquí */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}
