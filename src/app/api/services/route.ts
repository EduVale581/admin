import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { Service } from "@/lib/types";

export async function GET() {
  try {
    console.log("GET /api/services - Fetching all services");
    const result = await query<{
      id: string;
      company_id: string;
      name: string;
      price: number;
      status: string;
    }>("SELECT id, company_id, name, price, status FROM services ORDER BY id DESC");

    const services: Service[] = result.rows.map((row) => ({
      id: String(row.id),
      companyId: row.company_id,
      name: row.name,
      price: row.price,
      status: (row.status as "active" | "completed") || "active",
    }));

    console.log(`Retrieved ${services.length} services from database`);
    return NextResponse.json(services);
  } catch (error) {
    console.error("GET /api/services error:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("POST /api/services - Creating new service with data:", body);

    // Validate required fields
    if (!body.companyId || !body.name || body.price === undefined) {
      console.warn(
        "POST /api/services - Validation failed: Missing required fields"
      );
      return NextResponse.json(
        { error: "Missing required fields: companyId, name, and price" },
        { status: 400 }
      );
    }

    // Insert into database
    const result = await query<{
      id: string;
      company_id: string;
      name: string;
      price: number;
      status: string;
    }>(
      "INSERT INTO services (company_id, name, price, status) VALUES ($1, $2, $3, $4) RETURNING id, company_id, name, price, status",
      [body.companyId, body.name, Number(body.price), body.status || "active"]
    );

    const dbRow = result.rows[0];
    const newService: Service = {
      id: String(dbRow.id),
      companyId: dbRow.company_id,
      name: dbRow.name,
      price: dbRow.price,
      status: (dbRow.status as "active" | "completed") || "active",
    };

    console.log("POST /api/services - Service created successfully:", newService);

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error("POST /api/services error:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}
