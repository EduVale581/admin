import { query } from "@/lib/db";

type Company = {
  id: string;
  name: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export async function GET() {
  try {
    const result = await query<Company>(
      "SELECT id, name, status, created_at FROM companies ORDER BY created_at DESC"
    );

    return Response.json({
      ok: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return Response.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, action } = body;

    if (!id) {
      return Response.json(
        { ok: false, error: "ID is required in request body" },
        { status: 400 }
      );
    }

    if (!action || !["approve", "reject"].includes(action)) {
      return Response.json(
        { ok: false, error: "Action must be 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    // Validar que el ID sea un UUID válido
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return Response.json(
        { ok: false, error: "Invalid ID format" },
        { status: 400 }
      );
    }

    // Verificar que la compañía existe y está en estado pending
    const checkResult = await query<{ id: string; status: string }>(
      "SELECT id, status FROM companies WHERE id = $1",
      [id]
    );

    if (checkResult.rows.length === 0) {
      return Response.json(
        { ok: false, error: "Request not found" },
        { status: 404 }
      );
    }

    const company = checkResult.rows[0];
    if (company.status !== "pending") {
      return Response.json(
        { ok: false, error: `Cannot ${action} request with status '${company.status}'` },
        { status: 400 }
      );
    }

    // Actualizar el estado según la acción
    const newStatus = action === "approve" ? "approved" : "rejected";
    const updateResult = await query<{ id: string; status: string }>(
      "UPDATE companies SET status = $2 WHERE id = $1 RETURNING id, status",
      [id, newStatus]
    );

    return Response.json({
      ok: true,
      data: updateResult.rows[0],
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return Response.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}