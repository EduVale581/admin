import { query } from "@/lib/db";

type CreatePaymentBody = {
  serviceId: string;
  amount: number;
};

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<CreatePaymentBody>;

  if (!body.serviceId || typeof body.serviceId !== "string") {
    return Response.json({ error: "serviceId es requerido" }, { status: 400 });
  }

  if (typeof body.amount !== "number" || body.amount <= 0) {
    return Response.json(
      { error: "amount debe ser mayor que 0" },
      { status: 400 },
    );
  }

  const commissionAmount = body.amount * 0.1;

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

  const payment = paymentResult.rows[0];

  const commissionResult = await query<{
    id: string;
    payment_id: string;
    amount: number;
  }>(
    `
      insert into commissions (payment_id, amount)
      values ($1, $2)
      returning id, payment_id, amount
    `,
    [payment.id, commissionAmount],
  );

  return Response.json({
    ok: true,
    payment,
    commission: commissionResult.rows[0],
  });
}
