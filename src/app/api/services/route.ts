import { NextResponse } from "next/server";

import { query } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, description, price, companyId } = body;

    // Validar campos obligatorios
    if (!name || !price || !companyId) {
      return NextResponse.json(
        { message: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // Validar tipos de datos
    if (typeof name !== "string") {
      return NextResponse.json(
        { message: "name debe ser texto" },
        { status: 400 }
      );
    }

    if (typeof price !== "number") {
      return NextResponse.json(
        { message: "price debe ser número" },
        { status: 400 }
      );
    }

    if (typeof companyId !== "string") {
      return NextResponse.json(
        { message: "companyId inválido" },
        { status: 400 }
      );
    }

    // (SIMULACION) validar empresa
    // Aquí debería ir la validación real con BD
    // Por ahora lo dejamos simulado
    const companyExists = true;

    if (!companyExists) {
      return NextResponse.json(
        { message: "Empresa no encontrada" },
        { status: 404 }
      );
    }

    // 🔴 4. Crear servicio (simulado)
    const newService = {
      id: crypto.randomUUID(),
      name,
      description,
      price,
      companyId,
      createdAt: new Date()
    };

    // 🔴 5. Respuesta exitosa
    return NextResponse.json(newService, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { message: "Error del servidor" },
      { status: 500 }
    );
  }
}