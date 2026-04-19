"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Table from "@/components/Table";

export default function CommissionsPage() {
  const [data, setData] = useState<unknown[]>([]);

  useEffect(() => {
    api.get("/api/commissions").then(setData);
  }, []);

  return <Table data={data} />;
}
