import { query } from "@/lib/db";

type ProviderPaymentRow = {
  id: string;
  payment_id: string;
  provider_name: string;
  amount: number;
  status: "pending" | "paid";
};

type CreateProviderPaymentBody = {
  paymentId: string;
  providerName: string;
};

function toProviderView(row: ProviderPaymentRow) {
  return {
    id: row.id,
    paymentId: row.payment_id,
    providerName: row.provider_name,
    amount: row.amount,
    status: row.status,
    debt: row.status === "pending" ? row.amount : 0,
    creditBalance: row.status === "paid" ? row.amount : 0,
  };
}

export async function GET() {
  const result = await query<ProviderPaymentRow>(
    `
      select id, payment_id, provider_name, amount, status
      from provider_payments
      order by id desc
    `,
  );

  return Response.json(result.rows.map(toProviderView));
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<CreateProviderPaymentBody>;

  if (!body.paymentId || !body.providerName) {
    return Response.json(
      { error: "paymentId y providerName son requeridos" },
      { status: 400 },
    );
  }

  const paymentResult = await query<{ id: string; amount: number }>(
    `
      select id, amount
      from payments
      where id = $1
      limit 1
    `,
    [body.paymentId],
  );

  const payment = paymentResult.rows[0];

  if (!payment) {
    return Response.json({ error: "payment no existe" }, { status: 404 });
  }

  const existing = await query<{ id: string }>(
    `
      select id
      from provider_payments
      where payment_id = $1
      limit 1
    `,
    [body.paymentId],
  );

  if (existing.rows[0]) {
    return Response.json(
      { error: "ya existe registro para este payment" },
      { status: 409 },
    );
  }

  const providerAmount = Number((payment.amount * 0.9).toFixed(2));

  const insertResult = await query<ProviderPaymentRow>(
    `
      insert into provider_payments (payment_id, provider_name, amount, status)
      values ($1, $2, $3, 'pending')
      returning id, payment_id, provider_name, amount, status
    `,
    [body.paymentId, body.providerName, providerAmount],
  );

  return Response.json(toProviderView(insertResult.rows[0]), { status: 201 });
}