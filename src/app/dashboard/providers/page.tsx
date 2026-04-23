"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Table from "@/components/Table";

export default function ProvidersPage() {
  const [data, setData] = useState<unknown[]>([]);
  const [paymentId, setPaymentId] = useState("");
  const [providerName, setProviderName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loadProviders = () => {
    api.get("/api/providers").then(setData);
  };

  const createProviderPayment = async () => {
    setError(null);

    const res = await api.post("/api/providers", {
      paymentId,
      providerName,
    });

    if (res?.error) {
      setError(String(res.error));
      return;
    }

    setPaymentId("");
    setProviderName("");
    loadProviders();
  };

  useEffect(() => {
    loadProviders();
  }, []);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          placeholder="paymentId"
          value={paymentId}
          onChange={(e) => setPaymentId(e.target.value)}
        />
        <input
          placeholder="providerName"
          value={providerName}
          onChange={(e) => setProviderName(e.target.value)}
        />
        <button onClick={createProviderPayment}>Crear registro deuda/saldo</button>
      </div>

      {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}

      <Table data={data} />
    </div>
  );
}
