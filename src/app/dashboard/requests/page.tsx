"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Card from "@/components/Card";

type Company = {
  id: string;
  name: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export default function RequestsPage() {
  const [data, setData] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const result = await api.get("/api/requests");
      setData(result.data.data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await api.post("/api/requests", { id, action: "approve" });
      await fetchRequests(); // Recargar datos
    } catch (error) {
      console.error("Error approving request:", error);
      alert("Error al aprobar la solicitud");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.post("/api/requests", { id, action: "reject" });
      await fetchRequests(); // Recargar datos
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Error al rechazar la solicitud");
    }
  };

  if (loading) {
    return (
      <Card title="Solicitudes de Empresa">
        <p>Cargando solicitudes...</p>
      </Card>
    );
  }

  return (
    <Card title="Solicitudes de Empresa">
      {data.length === 0 ? (
        <p>No hay solicitudes pendientes</p>
      ) : (
        <table border={1} cellPadding={8} style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Fecha de Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((company) => (
              <tr key={company.id}>
                <td>{company.name}</td>
                <td>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      backgroundColor:
                        company.status === "pending"
                          ? "#fff3cd"
                          : company.status === "approved"
                          ? "#d1edff"
                          : "#f8d7da",
                      color:
                        company.status === "pending"
                          ? "#856404"
                          : company.status === "approved"
                          ? "#0c5460"
                          : "#721c24",
                    }}
                  >
                    {company.status === "pending"
                      ? "Pendiente"
                      : company.status === "approved"
                      ? "Aprobado"
                      : "Rechazado"}
                  </span>
                </td>
                <td>{new Date(company.created_at).toLocaleDateString()}</td>
                <td>
                  {company.status === "pending" && (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => handleApprove(company.id)}
                        style={{
                          backgroundColor: "#28a745",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => handleReject(company.id)}
                        style={{
                          backgroundColor: "#dc3545",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Rechazar
                      </button>
                    </div>
                  )}
                  {company.status !== "pending" && (
                    <span style={{ color: "#6c757d" }}>
                      {company.status === "approved" ? "Aprobado" : "Rechazado"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}
