import { NextResponse } from "next/server";

// Importar el almacén de códigos compartido
type GlobalWithRecoveryCodes = typeof globalThis & {
    __recoveryCodes?: Map<string, { code: string; createdAt: number }>;
    __resetTokens?: Map<string, { email: string; createdAt: number }>;
};

const globalForRecovery = globalThis as GlobalWithRecoveryCodes;

if (!globalForRecovery.__recoveryCodes) {
    globalForRecovery.__recoveryCodes = new Map();
}

if (!globalForRecovery.__resetTokens) {
    globalForRecovery.__resetTokens = new Map();
}

export const resetTokens = globalForRecovery.__resetTokens;

function generateToken(): string {
    return `reset-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, code } = body;

        if (!email || !code) {
            return NextResponse.json(
                { success: false, message: "Email y código son requeridos" },
                { status: 400 }
            );
        }

        const stored = globalForRecovery.__recoveryCodes?.get(email.toLowerCase());

        if (!stored) {
            return NextResponse.json(
                { success: false, message: "No se encontró una solicitud de recuperación para este email" },
                { status: 404 }
            );
        }

        // Verificar que el código no tenga más de 10 minutos
        const TEN_MINUTES = 10 * 60 * 1000;
        if (Date.now() - stored.createdAt > TEN_MINUTES) {
            globalForRecovery.__recoveryCodes?.delete(email.toLowerCase());
            return NextResponse.json(
                { success: false, message: "El código ha expirado. Solicita uno nuevo." },
                { status: 410 }
            );
        }

        if (stored.code !== code) {
            return NextResponse.json(
                { success: false, message: "El código ingresado es incorrecto" },
                { status: 400 }
            );
        }

        // Código válido — generar token de reset
        const token = generateToken();
        resetTokens.set(token, {
            email: email.toLowerCase(),
            createdAt: Date.now(),
        });

        // Limpiar el código usado
        globalForRecovery.__recoveryCodes?.delete(email.toLowerCase());

        return NextResponse.json({
            success: true,
            message: "Código verificado correctamente",
            token,
        });
    } catch {
        return NextResponse.json(
            { success: false, message: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
