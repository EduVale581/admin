import { query } from "@/lib/db";

export async function GET() {
  try {
    const result = await query<{
      id: string;
      nombre: string;
      fecha: string;
      estado: string;
    }>(
      `
        select
          id,
          name as nombre,
          created_at as fecha,
          status as estado
        from companies
        order by created_at desc
      `,
    );

    return Response.json(result.rows);
  } catch (error) {
    console.error("Error fetching requests:", error);
    return Response.json(
      { ok: false, error: "Error al obtener solicitudes" },
      { status: 500 },
    );
  }
}
