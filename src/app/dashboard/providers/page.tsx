"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Table from "@/components/Table";

//primero los datos que vienen del back
interface ProviderData {
  providerName: string;
  totalOwed: number;
}

//luego lo que se quiere mostrar en la tabla
interface TableRow{
  "Prestador": string;
  "Total Adeudado": string;
}

export default function ProvidersPage() {
  // Iniciamos los estados de la data y cargando
  const [data, setData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Consumimos el endpoint
    api.get("/api/providers")
      .then((response: ProviderData[]) => {
        
        // Transformamos los datos para la tabla
        const formattedData: TableRow[] = response.map((item) => ({
          "Prestador": item.providerName,
          // Le damos formato de moneda
          "Total Adeudado": `$${item.totalOwed.toLocaleString('es-CL')}` 
        }));

        setData(formattedData);
      })
      .catch((error) => {
        console.error("Error al cargar las deudas de los prestadores:", error);
      })
      .finally(() => {
        setLoading(false); // Terminamos de cargar, haya error o éxito
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Deudas con Prestadores</h1>
      
      {/* 3. Renderizado condicional basado en el estado */}
      {loading ? (
        <p className="text-gray-500">Cargando datos de prestadores...</p>
      ) : data.length > 0 ? (
        <Table data={data} />
      ) : (
        <p className="text-gray-500">No hay deudas pendientes registradas.</p>
      )}
    </div>
  );
}