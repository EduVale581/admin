"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Table from "@/components/Table";

export default function PaymentsPage() {
  const [data, setData] = useState<any[]>([]);

  // 🔧 mock de servicios (porque /api/services no existe)
  const [services] = useState([
    { id: "1", name: "Servicio Test" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ obtener pagos (arreglado)
  const fetchPayments = async () => {
    try {
      const res = await api.get("/api/payments");
      setData(res.payments || res.data || res);
    } catch (error) {
      console.error("Error cargando pagos", error);
    }
  };

  // ❌ antes: random + reload
  // ✅ ahora: form real + sin reload
  const createPayment = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("El monto debe ser mayor a 0");
      return;
    }

    if (!serviceId) {
      alert("Debes seleccionar un servicio");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/payments", {
        serviceId,
        amount: Number(amount),
      });

      // limpiar
      setShowModal(false);
      setAmount("");
      setServiceId("");

      // refrescar datos
      await fetchPayments();

    } catch (error) {
      console.error("Error creando pago", error);
      alert("Error al crear pago");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div>
      {/* BOTÓN */}
      <button onClick={() => setShowModal(true)}>
        Crear pago
      </button>

      {/* MODAL */}
      {showModal && (
        <div
          style={{
            border: "1px solid black",
            padding: "20px",
            marginTop: "10px",
            maxWidth: "300px",
          }}
        >
          <h3>Crear Pago</h3>

          {/* MONTO */}
          <input
            type="number"
            placeholder="Monto"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {/* SERVICIO */}
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
          >
            <option value="">Seleccionar servicio</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <div style={{ marginTop: "10px" }}>
            <button onClick={createPayment} disabled={loading}>
              {loading ? "Creando..." : "Enviar"}
            </button>

            <button onClick={() => setShowModal(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* TABLA */}
      <Table data={data} />
    </div>
  );
}