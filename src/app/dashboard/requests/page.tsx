"use client";

import { useState } from "react";
import styles from "./page.request.module.css";

type Company = {
  id: string;
  name: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export default function RequestTable() {
  const [requests, setRequests] = useState<Company[]>([
    { id: "1", name: "Solicitud 1", status: "pending", createdAt: "2023-01-01" },
    { id: "2", name: "Solicitud 2", status: "pending", createdAt: "2023-01-02" }
  ]);

  const handleAccept = (id: string) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id ? { ...req, status: "approved" } : req
      )
    );
  };

  const handleReject = (id: string) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id ? { ...req, status: "rejected" } : req
      )
    );
  };

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {requests.map(req => (
            <tr className={styles.Text} key={req.id}>
              <td>{req.id}</td>
              <td>{req.name}</td>

              {/* Estado con color */}
              <td className={styles[req.status]}>
                {req.status}
              </td>

             <td>
  {req.status === "pending" && (
    <>
      <button
        className={`${styles.btn} ${styles["btn-accept"]}`}
        onClick={() => handleAccept(req.id)}
      >
        ✔ Aceptar
      </button>

      <button
        className={`${styles.btn} ${styles["btn-reject"]}`}
        onClick={() => handleReject(req.id)}
      >
        ✖ Rechazar
      </button>
    </>
  )}

  {req.status === "approved" && (
    <button className={`${styles.btn} ${styles["btn-accept"]}`}>
      ✔ Aceptado
    </button>
  )}

  {req.status === "rejected" && (
    <button className={`${styles.btn} ${styles["btn-reject"]}`}>
      ✖ Rechazado
    </button>
  )}
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}