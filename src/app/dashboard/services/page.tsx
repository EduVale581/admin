"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Service } from "@/lib/types";
import ServiceForm from "@/components/ServiceForm";

export default function ServicesPage() {
  const [data, setData] = useState<Service[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    console.log("[Services Page] Fetching services...");
    api.get("/api/services").then((services) => {
      console.log("[Services Page] Services fetched:", services);
      setData(services);
    }).catch((error) => {
      console.error("[Services Page] Error fetching services:", error);
    });
  }, [refreshKey]);

  const handleServiceAdded = (newService: Service) => {
    // Refresh the services list
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div>
      <h1>Services Management</h1>
      <ServiceForm onServiceAdded={handleServiceAdded} />
      
      <div style={{ marginTop: "30px" }}>
        <h2>Services List</h2>
        {data.length === 0 ? (
          <p style={{ color: "#666" }}>No services created yet.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid #ddd",
                backgroundColor: "#fff",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#077704" }}>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "12px",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    ID
                  </th>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "12px",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    Company ID
                  </th>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "12px",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    Name
                  </th>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "12px",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    Price
                  </th>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "12px",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((service, index) => (
                  <tr
                    key={service.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#ddd" : "#ddd",
                      color: "black",
                    }}
                  >
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "12px",
                      }}
                    >
                      {service.id}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "12px",
                      }}
                    >
                      {service.companyId}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "12px",
                      }}
                    >
                      {service.name}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "12px",
                      }}
                    >
                      ${Number(service.price).toFixed(2)}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "12px",
                      }}
                    >
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: "4px",
                          backgroundColor:
                            service.status === "active" ? "#58b16c" : "#5e4d18",
                          color:
                            service.status === "active" ? "#063310" : "#856404",
                          fontWeight: "500",
                        }}
                      >
                        {service.status.charAt(0).toUpperCase() +
                          service.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
