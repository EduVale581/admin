import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const result = await query("SELECT * FROM provider_payments");

    const providersMap: Record<string, number> = {};

    result.rows.forEach((p) => {
      const providerName = p.provider_name; // en caso de que en al base de datos se use _
      const amount = Number(p.amount) || 0;

      // 👉 solo lo que se debe
      if (p.status === "pending") {
        if (!providersMap[providerName]) {
          providersMap[providerName] = 0;
        }

        providersMap[providerName] += amount;
      }
    });

    const providers = Object.entries(providersMap).map(
      ([providerName, totalOwed]) => ({
        providerName,
        totalOwed,
      })
    );

    return NextResponse.json(providers);
  } catch (error) {
    console.error("Error obteniendo providers:", error);

    return NextResponse.json(
      { error: "Error al obtener providers" },
      { status: 500 }
    );
  }
}