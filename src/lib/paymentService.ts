import { withTransaction } from "@/lib/db";
import { CommissionCalculatorFactoryProviderBuilder } from "@/lib/commissionFactory";

const calculator = new CommissionCalculatorFactoryProviderBuilder().build();

export class PaymentNotFoundError extends Error {}
export class PaymentAlreadyConfirmedError extends Error {}

export async function confirmPayment(paymentId: string, providerName: string) {
  return withTransaction(async (client) => {
    const { rows } = await client.query<{
      id: string;
      amount: number;
      status: string;
    }>("SELECT id, amount, status FROM payments WHERE id = $1", [paymentId]);

    if (rows.length === 0) throw new PaymentNotFoundError("Payment not found");
    if (rows[0].status !== "pending")
      throw new PaymentAlreadyConfirmedError("Payment is not pending");

    const total = rows[0].amount;
    const commissionAmount = Math.round(calculator.calculate(total));
    const providerAmount = total - commissionAmount;

    await client.query(
      "UPDATE payments SET status = 'paid' WHERE id = $1",
      [paymentId],
    );

    const { rows: providerRows } = await client.query<{
      id: string;
      payment_id: string;
      provider_name: string;
      amount: number;
      status: string;
    }>(
      `INSERT INTO provider_payments (payment_id, provider_name, amount, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING id, payment_id, provider_name, amount, status`,
      [paymentId, providerName, providerAmount],
    );

    const { rows: commissionRows } = await client.query<{
      id: string;
      payment_id: string;
      amount: number;
    }>(
      `INSERT INTO commissions (payment_id, amount)
       VALUES ($1, $2)
       RETURNING id, payment_id, amount`,
      [paymentId, commissionAmount],
    );

    return {
      payment: { id: rows[0].id, amount: total, status: "paid" },
      providerPayment: providerRows[0],
      commission: commissionRows[0],
    };
  });
}
