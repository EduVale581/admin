import { NextResponse } from "next/server";

type GlobalWithResetTokens = typeof globalThis & {
    __resetTokens?: Map<string, { email: string; createdAt: number }>;
};

const globalForRecovery = globalThis as GlobalWithResetTokens;

if (!globalForRecovery.__resetTokens) {
    globalForRecovery.__resetTokens = new Map();
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { token, password } = body;

        if (!token || !password) {
            return NextResponse.json(
                { success: false, message: "Token y contraseña son requeridos" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { success: false, message: "La contraseña debe tener al menos 6 caracteres" },
                { status: 400 }
            );
        }

        const stored = globalForRecovery.__resetTokens?.get(token);

        if (!stored) {
            return NextResponse.json(
                { success: false, message: "Token inválido o expirado" },
                { status: 400 }
            );
        }

        // Verificar que el token no tenga más de 30 minutos
        const THIRTY_MINUTES = 30 * 60 * 1000;
        if (Date.now() - stored.createdAt > THIRTY_MINUTES) {
            globalForRecovery.__resetTokens?.delete(token);
            return NextResponse.json(
                { success: false, message: "El token ha expirado. Inicia el proceso nuevamente." },
                { status: 410 }
            );
        }

        // SIMULACIÓN: En producción aquí se actualizaría la contraseña en la BD
        console.log(`[SIMULACIÓN] Contraseña actualizada para: ${stored.email}`);

        // Limpiar el token usado
        globalForRecovery.__resetTokens?.delete(token);

        return NextResponse.json({
            success: true,
            message: "Contraseña actualizada exitosamente (simulado)",
            email: stored.email,
        });
    } catch {
        return NextResponse.json(
            { success: false, message: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
