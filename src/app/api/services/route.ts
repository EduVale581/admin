import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const result = await query("SELECT * FROM services");

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error obteniendo servicios:", error);

    return NextResponse.json(
      { error: "Error al obtener servicios" },
      { status: 500 }
    );
  }
}