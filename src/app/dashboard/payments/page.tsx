"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function PaymentsPage() {
  const [serviceId, setServiceId] = useState("");
  const [amount, setAmount] = useState("");

  const createPayment = async () => {
    if (!serviceId || !amount) {
      alert("Completa serviceId y amount");
      return;
    }

    await api.post("/api/payments", {
      serviceId,
      amount: Number(amount),
    });

    setServiceId("");
    setAmount("");
    alert("Pago enviado");
  };

  return (
    <div>
      <h1>Pagos</h1>

      <input
        type="text"
        placeholder="Service ID"
        value={serviceId}
        onChange={(e) => setServiceId(e.target.value)}
      />

      <input
        type="number"
        placeholder="Monto"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={createPayment}>Crear pago</button>
    </div>
  );
}