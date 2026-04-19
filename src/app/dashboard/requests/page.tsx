"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Table from "@/components/Table";
import Card from "@/components/Card";

export default function RequestsPage() {
  const [data, setData] = useState<unknown[]>([]);

  useEffect(() => {
    api.get("/api/requests").then(setData);
  }, []);

  return (
    <Card title="Solicitudes de Empresa">
      <Table data={data} />
    </Card>
  );
}
