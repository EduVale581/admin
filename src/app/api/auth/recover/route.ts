import { NextResponse } from "next/server";

// Almacén simulado en memoria para códigos de recuperación
type GlobalWithRecoveryCodes = typeof globalThis & {
    __recoveryCodes?: Map<string, { code: string; createdAt: number }>;
};

const globalForRecovery = globalThis as GlobalWithRecoveryCodes;

if (!globalForRecovery.__recoveryCodes) {
    globalForRecovery.__recoveryCodes = new Map();
}

export const recoveryCodes = globalForRecovery.__recoveryCodes;

function generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email || typeof email !== "string") {
            return NextResponse.json(
                { success: false, message: "El email es requerido" },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, message: "El formato del email no es válido" },
                { status: 400 }
            );
        }

        const code = generateCode();

        recoveryCodes.set(email.toLowerCase(), {
            code,
            createdAt: Date.now(),
        });

        // SIMULACIÓN: En producción se enviaría el código por email.
        // Aquí lo devolvemos directamente en la respuesta.
        return NextResponse.json({
            success: true,
            message: "Código de recuperación generado (simulado)",
            code, // Solo para simulación — no hacer esto en producción
            email: email.toLowerCase(),
        });
    } catch {
        return NextResponse.json(
            { success: false, message: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
