import {
  confirmPayment,
  PaymentAlreadyConfirmedError,
  PaymentNotFoundError,
} from "@/lib/paymentService";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = (await req.json()) as { providerName?: string };

    if (!body.providerName) {
      return Response.json(
        { ok: false, error: "Missing providerName" },
        { status: 400 },
      );
    }

    const result = await confirmPayment(id, body.providerName);
    return Response.json({ ok: true, ...result });
  } catch (error) {
    if (error instanceof PaymentNotFoundError) {
      return Response.json({ ok: false, error: error.message }, { status: 404 });
    }
    if (error instanceof PaymentAlreadyConfirmedError) {
      return Response.json({ ok: false, error: error.message }, { status: 409 });
    }
    return Response.json(
      { ok: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
