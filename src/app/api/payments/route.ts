import { query } from "@/lib/db";

type CreatePaymentBody = {
  serviceId: string;
  amount: number;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<CreatePaymentBody>;

    // NUEVO: validación de datos obligatorios
    if (!body.serviceId || body.amount === undefined) {
      return Response.json(
        { ok: false, error: "Missing serviceId or amount" },
        { status: 400 },
      );
    }

    // NUEVO: validación de negocio
    if (body.amount <= 0) {
      return Response.json(
        { ok: false, error: "Amount must be greater than 0" },
        { status: 400 },
      );
    }

    const paymentResult = await query<{
      id: string;
      service_id: string;
      amount: number;
      status: string;
      created_at: string;
    }>(
      `
        insert into payments (service_id, amount, status)
        values ($1, $2, 'pending')
        returning id, service_id, amount, status, created_at
      `,
      [body.serviceId, body.amount],
    );

    return Response.json({ ok: true, payment: paymentResult.rows[0] });
  } catch (error) {
    // manejo básico de error
    return Response.json(
      { ok: false, error: "Internal server error" },
      { status: 500 },
    );
  }
} // ya
