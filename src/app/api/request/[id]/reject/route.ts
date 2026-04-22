import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    const body = await req.json().catch(() => null);

    if (!body?.reason?.trim()) {
    return NextResponse.json(
        { error: "Debes especificar una razón de rechazo" },
        { status: 400 }
        );
    }

    return NextResponse.json({
    id: params.id,
    status: "REJECTED",
    reason: body.reason.trim(),
    });
}