"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Table from "@/components/Table";

type ProviderPayment = {
  id: string;
  paymentId: string;
  providerName: string;
  amount: number;
  status: "pending" | "paid";
};

type SummaryByProvider = {
  providerName: string;
  totalOwed: number;
  totalPaid: number;
  pendingCount: number;
  paidCount: number;
  payments: ProviderPayment[];
};

export default function ProvidersPage() {
  const [providers, setProviders] = useState<SummaryByProvider[]>([]);
  const [rawData, setRawData] = useState<ProviderPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  async function fetchProviders() {
    try {
      setLoading(true);
      setError(null);
      const data: ProviderPayment[] = await api.get("/api/providers");
      setRawData(data);

      // Agrupar por prestador
      const grouped: Record<string, SummaryByProvider> = {};
      for (const p of data) {
        if (!grouped[p.providerName]) {
          grouped[p.providerName] = {
            providerName: p.providerName,
            totalOwed: 0,
            totalPaid: 0,
            pendingCount: 0,
            paidCount: 0,
            payments: [],
          };
        }
        const g = grouped[p.providerName];
        if (p.status === "pending") {
          g.totalOwed += p.amount;
          g.pendingCount += 1;
        } else {
          g.totalPaid += p.amount;
          g.paidCount += 1;
        }
        g.payments.push(p);
      }

      setProviders(Object.values(grouped));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  async function markAsPaid(paymentId: string) {
    try {
      await api.post(`/api/providers/${paymentId}/pay`, {});
      await fetchProviders();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error al pagar");
    }
  }

  const totalPendiente = providers.reduce((acc, p) => acc + p.totalOwed, 0);
  const totalPagado = providers.reduce((acc, p) => acc + p.totalPaid, 0);

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <p style={styles.headerEyebrow}>PEPITO PLATFORM</p>
          <h1 style={styles.headerTitle}>Pagos a Prestadores</h1>
          <p style={styles.headerSub}>
            Panel de gestión de pagos a proveedores de servicio
          </p>
        </div>
        <button onClick={fetchProviders} style={styles.refreshBtn}>
          ↻ Actualizar
        </button>
      </div>

      {/* KPI Cards */}
      <div style={styles.kpiRow}>
        <div style={{ ...styles.kpiCard, borderTop: "3px solid #f59e0b" }}>
          <span style={styles.kpiLabel}>Por pagar</span>
          <span style={{ ...styles.kpiValue, color: "#f59e0b" }}>
            ${totalPendiente.toLocaleString("es-CL")}
          </span>
        </div>
        <div style={{ ...styles.kpiCard, borderTop: "3px solid #10b981" }}>
          <span style={styles.kpiLabel}>Total pagado</span>
          <span style={{ ...styles.kpiValue, color: "#10b981" }}>
            ${totalPagado.toLocaleString("es-CL")}
          </span>
        </div>
        <div style={{ ...styles.kpiCard, borderTop: "3px solid #6366f1" }}>
          <span style={styles.kpiLabel}>Prestadores activos</span>
          <span style={{ ...styles.kpiValue, color: "#6366f1" }}>
            {providers.length}
          </span>
        </div>
      </div>

      {/* Content */}
      {loading && (
        <div style={styles.stateBox}>
          <div style={styles.spinner} />
          <p style={styles.stateText}>Cargando prestadores…</p>
        </div>
      )}

      {error && (
        <div style={styles.errorBox}>
          <span style={styles.errorIcon}>⚠</span>
          <div>
            <p style={styles.errorTitle}>No se pudo cargar la información</p>
            <p style={styles.errorMsg}>{error}</p>
          </div>
          <button onClick={fetchProviders} style={styles.retryBtn}>
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && providers.length === 0 && (
        <div style={styles.stateBox}>
          <p style={styles.stateIcon}>🧑‍🔧</p>
          <p style={styles.stateText}>No hay pagos a prestadores registrados</p>
        </div>
      )}

      {!loading && !error && providers.length > 0 && (
        <div style={styles.providerList}>
          {providers.map((prov) => {
            const isExpanded = expandedProvider === prov.providerName;
            return (
              <div key={prov.providerName} style={styles.providerCard}>
                {/* Provider header row */}
                <button
                  style={styles.providerRow}
                  onClick={() =>
                    setExpandedProvider(isExpanded ? null : prov.providerName)
                  }
                >
                  <div style={styles.providerAvatar}>
                    {prov.providerName.charAt(0).toUpperCase()}
                  </div>
                  <div style={styles.providerInfo}>
                    <span style={styles.providerName}>{prov.providerName}</span>
                    <span style={styles.providerMeta}>
                      {prov.pendingCount + prov.paidCount} pago
                      {prov.pendingCount + prov.paidCount !== 1 ? "s" : ""} ·{" "}
                      {prov.pendingCount} pendiente
                      {prov.pendingCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div style={styles.providerAmounts}>
                    {prov.totalOwed > 0 && (
                      <span style={styles.amountPending}>
                        ${prov.totalOwed.toLocaleString("es-CL")} pendiente
                      </span>
                    )}
                    {prov.totalPaid > 0 && (
                      <span style={styles.amountPaid}>
                        ${prov.totalPaid.toLocaleString("es-CL")} pagado
                      </span>
                    )}
                  </div>
                  <span style={styles.chevron}>{isExpanded ? "▲" : "▼"}</span>
                </button>

                {/* Expanded payment detail */}
                {isExpanded && (
                  <div style={styles.paymentTable}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>ID Pago</th>
                          <th style={styles.th}>Monto</th>
                          <th style={styles.th}>Estado</th>
                          <th style={styles.th}>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prov.payments.map((pay) => (
                          <tr key={pay.id} style={styles.tr}>
                            <td style={styles.td}>
                              <code style={styles.code}>{pay.paymentId}</code>
                            </td>
                            <td style={styles.td}>
                              ${pay.amount.toLocaleString("es-CL")}
                            </td>
                            <td style={styles.td}>
                              <span
                                style={
                                  pay.status === "paid"
                                    ? styles.badgePaid
                                    : styles.badgePending
                                }
                              >
                                {pay.status === "paid" ? "Pagado" : "Pendiente"}
                              </span>
                            </td>
                            <td style={styles.td}>
                              {pay.status === "pending" ? (
                                <button
                                  style={styles.payBtn}
                                  onClick={() => markAsPaid(pay.id)}
                                >
                                  Marcar pagado
                                </button>
                              ) : (
                                <span style={styles.doneText}>✓ Listo</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tabla raw de tu compañero — datos planos de todos los provider_payments */}
      {!loading && !error && rawData.length > 0 && (
        <div style={styles.rawSection}>
          <p style={styles.rawLabel}>Vista de datos completos</p>
          <Table data={rawData} />
        </div>
      )}
    </div>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  page: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    minHeight: "100vh",
    background: "#0f0f13",
    color: "#e2e8f0",
    padding: "2rem",
    maxWidth: "900px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "2rem",
    borderBottom: "1px solid #1e1e2e",
    paddingBottom: "1.5rem",
  },
  headerEyebrow: {
    fontSize: "0.7rem",
    letterSpacing: "0.15em",
    color: "#6366f1",
    fontWeight: 700,
    marginBottom: "0.25rem",
    textTransform: "uppercase",
  },
  headerTitle: {
    fontSize: "1.8rem",
    fontWeight: 800,
    color: "#f8fafc",
    margin: "0 0 0.25rem",
  },
  headerSub: {
    fontSize: "0.85rem",
    color: "#64748b",
    margin: 0,
  },
  refreshBtn: {
    background: "transparent",
    border: "1px solid #334155",
    color: "#94a3b8",
    borderRadius: "8px",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
  kpiRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1rem",
    marginBottom: "2rem",
  },
  kpiCard: {
    background: "#16161f",
    border: "1px solid #1e1e2e",
    borderRadius: "12px",
    padding: "1.25rem 1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  kpiLabel: {
    fontSize: "0.75rem",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  kpiValue: {
    fontSize: "1.6rem",
    fontWeight: 800,
  },
  stateBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "4rem 2rem",
    background: "#16161f",
    borderRadius: "12px",
    border: "1px solid #1e1e2e",
    gap: "0.75rem",
  },
  stateIcon: {
    fontSize: "2.5rem",
    margin: 0,
  },
  stateText: {
    color: "#64748b",
    fontSize: "0.9rem",
    margin: 0,
  },
  spinner: {
    width: "32px",
    height: "32px",
    border: "3px solid #1e1e2e",
    borderTop: "3px solid #6366f1",
    borderRadius: "50%",
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    background: "#1c0f0f",
    border: "1px solid #7f1d1d",
    borderRadius: "12px",
    padding: "1.25rem 1.5rem",
  },
  errorIcon: {
    fontSize: "1.5rem",
    color: "#ef4444",
  },
  errorTitle: {
    color: "#fca5a5",
    fontWeight: 600,
    fontSize: "0.9rem",
    margin: "0 0 0.2rem",
  },
  errorMsg: {
    color: "#7f1d1d",
    fontSize: "0.8rem",
    margin: 0,
  },
  retryBtn: {
    marginLeft: "auto",
    background: "#7f1d1d",
    border: "none",
    color: "#fca5a5",
    borderRadius: "8px",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    fontSize: "0.8rem",
    whiteSpace: "nowrap",
  },
  providerList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  providerCard: {
    background: "#16161f",
    border: "1px solid #1e1e2e",
    borderRadius: "12px",
    overflow: "hidden",
  },
  providerRow: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1.1rem 1.5rem",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
    color: "inherit",
  },
  providerAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "#1e1e3a",
    color: "#818cf8",
    fontSize: "1.1rem",
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  providerInfo: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minWidth: 0,
  },
  providerName: {
    fontWeight: 700,
    fontSize: "0.95rem",
    color: "#f1f5f9",
  },
  providerMeta: {
    fontSize: "0.75rem",
    color: "#64748b",
    marginTop: "0.15rem",
  },
  providerAmounts: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  amountPending: {
    background: "#2d1f00",
    color: "#f59e0b",
    borderRadius: "6px",
    padding: "0.25rem 0.6rem",
    fontSize: "0.78rem",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  amountPaid: {
    background: "#052e16",
    color: "#10b981",
    borderRadius: "6px",
    padding: "0.25rem 0.6rem",
    fontSize: "0.78rem",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  chevron: {
    color: "#475569",
    fontSize: "0.7rem",
    flexShrink: 0,
  },
  paymentTable: {
    borderTop: "1px solid #1e1e2e",
    padding: "0 1.5rem 1.25rem",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem",
  },
  th: {
    textAlign: "left",
    fontSize: "0.7rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#475569",
    padding: "0.5rem 0.75rem",
    borderBottom: "1px solid #1e1e2e",
  },
  tr: {
    borderBottom: "1px solid #1a1a24",
  },
  td: {
    padding: "0.7rem 0.75rem",
    fontSize: "0.85rem",
    color: "#cbd5e1",
  },
  code: {
    fontFamily: "monospace",
    background: "#0f0f13",
    borderRadius: "4px",
    padding: "0.15rem 0.4rem",
    fontSize: "0.8rem",
    color: "#818cf8",
  },
  badgePaid: {
    background: "#052e16",
    color: "#10b981",
    borderRadius: "5px",
    padding: "0.2rem 0.55rem",
    fontSize: "0.75rem",
    fontWeight: 600,
  },
  badgePending: {
    background: "#2d1f00",
    color: "#f59e0b",
    borderRadius: "5px",
    padding: "0.2rem 0.55rem",
    fontSize: "0.75rem",
    fontWeight: 600,
  },
  payBtn: {
    background: "#1e1e3a",
    border: "1px solid #3730a3",
    color: "#818cf8",
    borderRadius: "6px",
    padding: "0.3rem 0.75rem",
    cursor: "pointer",
    fontSize: "0.78rem",
    fontWeight: 600,
  },
  doneText: {
    color: "#334155",
    fontSize: "0.8rem",
  },
  rawSection: {
    marginTop: "2.5rem",
    borderTop: "1px solid #1e1e2e",
    paddingTop: "1.5rem",
  },
  rawLabel: {
    fontSize: "0.7rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#475569",
    marginBottom: "0.75rem",
  },
};
