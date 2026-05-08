"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./recover.module.css";

export default function RecoverPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/recover", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Error al enviar solicitud");
                return;
            }

            // Guardar email y código simulado en sessionStorage para el siguiente paso
            sessionStorage.setItem("recover_email", email);
            sessionStorage.setItem("recover_code", data.code);
            router.push("/recover/verify");
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
                    <div className={styles.stepDot} />
                    <div className={styles.stepLine} />
                    <div className={styles.stepDot} />
                </div>

                <div className={styles.icon}>📧</div>
                <h1 className={styles.recoverTitle}>Recuperar cuenta</h1>
                <p className={styles.recoverSubtitle}>
                    Ingresa tu correo electrónico y te enviaremos un código de verificación
                    para recuperar tu cuenta.
                </p>

                {error && <div className={styles.errorMessage}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel} htmlFor="email">
                            Correo electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            className={styles.formInput}
                            placeholder="tu@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? "Enviando..." : "Enviar código de recuperación"}
                    </button>
                </form>

                <a href="/" className={styles.backLink}>
                    ← Volver al inicio
                </a>
            </div>
        </div>
    );
}
