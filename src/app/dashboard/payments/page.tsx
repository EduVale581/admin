"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Table from "@/components/Table";

export default function PaymentsPage() {
  const [data, setData] = useState<unknown[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [amount, setAmount] = useState("");

  const loadPayments = async () => {
    const payments = await api.get("/api/payments");
    setData(payments);
  };

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
    location.reload();
  };

  useEffect(() => {
    loadPayments();
  }, []);

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

      <Table data={data} />
    </div>
  );
}