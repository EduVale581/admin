"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../recover.module.css";

export default function VerifyCodePage() {
    const [code, setCode] = useState("");
    const [simulatedCode, setSimulatedCode] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const storedEmail = sessionStorage.getItem("recover_email");
        const storedCode = sessionStorage.getItem("recover_code");

        if (!storedEmail || !storedCode) {
            router.push("/recover");
            return;
        }

        setEmail(storedEmail);
        setSimulatedCode(storedCode);
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/verify-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Error al verificar código");
                return;
            }

            // Guardar token para el siguiente paso
            sessionStorage.setItem("reset_token", data.token);
            sessionStorage.removeItem("recover_code");
            router.push("/recover/reset");
        } catch {
            setError("Error de conexión. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.recoverContainer}>
            <div className={styles.recoverCard}>
                {/* Step indicator */}
                <div className={styles.stepIndicator}>
                    <div className={`${styles.stepDot} ${styles.stepDotActive}`} />
                    <div className={styles.stepLine} />
                    <div className={`${styles.stepDot} ${styles.stepDotActive}`} />
                    <div className={styles.stepLine} />
                    <div className={styles.stepDot} />
                </div>

                <div className={styles.icon}>🔑</div>
                <h1 className={styles.recoverTitle}>Verificar código</h1>
                <p className={styles.recoverSubtitle}>
                    Ingresa el código de verificación enviado a <strong>{email}</strong>
                </p>

                {/* Mostrar código simulado */}
                <div className={styles.simulatedCode}>
                    <p className={styles.simulatedCodeLabel}>
                        ⚠️ Código simulado (no se envió email real)
                    </p>
                    <p className={styles.simulatedCodeValue}>{simulatedCode}</p>
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel} htmlFor="code">
                            Código de verificación
                        </label>
                        <input
                            id="code"
                            type="text"
                            className={styles.formInput}
                            placeholder="Ingresa el código de 6 dígitos"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            maxLength={6}
                            required
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? "Verificando..." : "Verificar código"}
                    </button>
                </form>

                <a href="/recover" className={styles.backLink}>
                    ← Volver a ingresar email
                </a>
            </div>
        </div>
    );
}
