import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const result = await query("SELECT * FROM services");

    const services = result.rows.map((service) => ({
      id: service.id,
      companyId: service.company_id, // transformación
      name: service.name,
      status: service.status,
      price: Number(service.price), // transformación
    }));

    return NextResponse.json(services);
  } catch (error) {
    console.error("Error obteniendo servicios:", error);

    return NextResponse.json(
      { error: "Error al obtener servicios" },
      { status: 500 }
    );
  }
}