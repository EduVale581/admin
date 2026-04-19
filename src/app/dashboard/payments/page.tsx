"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Table from "@/components/Table";

export default function PaymentsPage() {
  const [data, setData] = useState<unknown[]>([]);

  const createPayment = async () => {
    await api.post("/api/payments", {
      amount: Math.floor(Math.random() * 1000),
    });
    location.reload();
  };

  useEffect(() => {
    api.get("/api/payments").then(setData);
  }, []);

  return (
    <div>
      <button onClick={createPayment}>Crear pago</button>
      <Table data={data} />
    </div>
  );
}
