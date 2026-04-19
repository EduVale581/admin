"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Table from "@/components/Table";

export default function ServicesPage() {
  const [data, setData] = useState<unknown[]>([]);

  useEffect(() => {
    api.get("/api/services").then(setData);
  }, []);

  return <Table data={data} />;
}
