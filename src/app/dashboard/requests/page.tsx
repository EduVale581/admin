"use client";

import { useState } from "react";
import Card from "@/components/Card";

interface Company {
  id: string;
  name: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const mockCompanies: Company[] = [
  {
    id: "1",
    name: "Empresa Alfa",
    status: "pending",
    createdAt: "2024-05-10",
  },
  {
    id: "2",
    name: "Beta Corp",
    status: "approved",
    createdAt: "2024-05-11",
  },
  {
    id: "3",
    name: "Gamma Solutions",
    status: "rejected",
    createdAt: "2024-05-12",
  },
];

export default function RequestsPage() {
  const [data] = useState<Company[]>(mockCompanies);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "#4caf50";
      case "rejected":
        return "#f44336";
      default:
        return "#ff9800";
    }
  };

  return (
    <Card title="Solicitudes de Empresa">
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}
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
              <td style={{ padding: "10px" }}>{company.name}</td>
              <td style={{ padding: "10px" }}>{company.createdAt}</td>
              <td style={{ padding: "10px" }}>
                <span
                  style={{
                    backgroundColor: getStatusColor(company.status),
                    color: "white",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                >
                  {company.status === "pending"
                    ? "Pendiente"
                    : company.status === "approved"
                    ? "Aprobado"
                    : "Rechazado"}
                </span>
              </td>
              <td style={{ padding: "10px" }}></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
