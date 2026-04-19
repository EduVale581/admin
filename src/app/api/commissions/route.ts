export async function POST(req: Request) {
  const body = (await req.json()) as { amount?: number };

  if (typeof body.amount !== "number" || body.amount <= 0) {
    return Response.json(
      { error: "amount debe ser mayor que 0" },
      { status: 400 },
    );
  }

  const commission = body.amount * 0.1;

  return Response.json({ commission });
}
