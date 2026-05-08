"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../recover.module.css";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [token, setToken] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const storedToken = sessionStorage.getItem("reset_token");

        if (!storedToken) {
            router.push("/recover");
            return;
        }

        setToken(storedToken);
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Error al cambiar contraseña");
                return;
            }

            // Limpiar sessionStorage
            sessionStorage.removeItem("reset_token");
            sessionStorage.removeItem("recover_email");
            setSuccess(true);
        } catch {
            setError("Error de conexión. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className={styles.recoverContainer}>
                <div className={styles.recoverCard}>
                    <div className={styles.successCard}>
                        <div className={styles.successIcon}>✅</div>
                        <h1 className={styles.successTitle}>¡Contraseña actualizada!</h1>
                        <p className={styles.successText}>
                            Tu contraseña ha sido cambiada exitosamente (simulado).
                            Ya puedes iniciar sesión con tu nueva contraseña.
                        </p>
                        <a href="/" className={styles.submitButton} style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
                            Ir al inicio
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.recoverContainer}>
            <div className={styles.recoverCard}>
                {/* Step indicator */}
                <div className={styles.stepIndicator}>
                    <div className={`${styles.stepDot} ${styles.stepDotActive}`} />
                    <div className={styles.stepLine} />
                    <div className={`${styles.stepDot} ${styles.stepDotActive}`} />
                    <div className={styles.stepLine} />
                    <div className={`${styles.stepDot} ${styles.stepDotActive}`} />
                </div>

                <div className={styles.icon}>🔒</div>
                <h1 className={styles.recoverTitle}>Nueva contraseña</h1>
                <p className={styles.recoverSubtitle}>
                    Ingresa tu nueva contraseña para completar la recuperación de tu cuenta.
                </p>

                {error && <div className={styles.errorMessage}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel} htmlFor="password">
                            Nueva contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            className={styles.formInput}
                            placeholder="Mínimo 6 caracteres"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoFocus
                        />
                        <p className={styles.passwordRequirements}>
                            Debe tener al menos 6 caracteres
                        </p>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel} htmlFor="confirmPassword">
                            Confirmar contraseña
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            className={styles.formInput}
                            placeholder="Repite tu contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? "Actualizando..." : "Cambiar contraseña"}
                    </button>
                </form>

                <a href="/recover" className={styles.backLink}>
                    ← Volver al inicio del proceso
                </a>
            </div>
        </div>
    );
}
