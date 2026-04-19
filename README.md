# 🧪 Taller: PEPITO – Desarrollo Fullstack bajo caos controlado

## 🎯 Contexto

Estás desarrollando el panel interno de **PEPITO**, una plataforma que conecta empresas con prestadores de servicios.

El sistema debe permitir:

1. Gestionar solicitudes de empresas
2. Gestionar servicios contratados
3. Gestionar pagos vía Webpay
4. Gestionar pagos a prestadores
5. Gestionar comisiones

⚠️ El sistema está incompleto, inconsistente y con errores.

---

# 🗄️ MODELO DE DATOS

## 📌 Entidades principales

### 🧾 `companies`

```ts
id: string;
name: string;
status: "pending" | "approved" | "rejected";
createdAt: string;
```

---

### 💼 `services`

```ts
id: string;
companyId: string;
name: string;
status: "active" | "completed";
price: number;
```

---

### 💳 `payments`

```ts
id: string;
serviceId: string;
amount: number;
status: "pending" | "paid";
createdAt: string;
```

---

### 🧑‍🔧 `provider_payments`

```ts
id: string;
paymentId: string;
providerName: string;
amount: number;
status: "pending" | "paid";
```

---

### 💰 `commissions`

```ts
id: string;
paymentId: string;
amount: number;
```

---

## 🔗 Relaciones

- 1 Company → muchos Services
- 1 Service → muchos Payments
- 1 Payment → 1 Provider Payment
- 1 Payment → 1 Commission

---

# 🚀 LEVANTAR PROYECTO

```bash
npm install
npm run dev
```

Abrir:

```
http://localhost:3000/dashboard
```

---

# 🧩 REGLAS

- ❌ No borrar todo
- ❌ No rehacer desde cero
- ✅ Arreglar lo existente
- ✅ Trabajar en equipo

---

# 🧪 TAREAS FULLSTACK

---

## 🧾 TAREA 1: Solicitudes de empresa

📍 Front: `/dashboard/requests`
📍 Back: `/api/requests`

### Backend

- Implementar:
  - `GET /api/requests`
  - `POST /api/requests/:id/approve`
  - `POST /api/requests/:id/reject`

### Frontend

- Mostrar tabla de empresas
- Agregar botones:
  - Aprobar
  - Rechazar

### Problemas esperados

- Endpoint vacío
- Estado no se actualiza
- UI no refresca

---

## 💼 TAREA 2: Servicios

📍 Front: `/dashboard/services`
📍 Back: `/api/services`

### Backend

- Crear:
  - `GET /api/services`
  - `POST /api/services`

### Frontend

- Listar servicios
- Crear servicio (form simple)

### Problemas esperados

- companyId incorrecto
- datos inconsistentes

---

## 💳 TAREA 3: Pagos (Webpay simulado)

📍 Front: `/dashboard/payments`
📍 Back: `/api/payments`

### Backend

- Crear pago
- Validar:
  - amount > 0

- Generar comisión (10%)

### Frontend

- Botón "Crear pago"
- Mostrar lista

### Problemas esperados

- cálculo incorrecto
- datos duplicados
- API rota

---

## 🧑‍🔧 TAREA 4: Pagos a prestadores

📍 Front: `/dashboard/providers`
📍 Back: `/api/providers`

### Backend

- Generar pago a prestador basado en payment
- Regla:
  - provider recibe 90%
  - plataforma 10%

### Frontend

- Mostrar cuánto se le debe a cada prestador

### Problemas esperados

- lógica inexistente
- datos incompletos

---

## 💰 TAREA 5: Comisiones

📍 Front: `/dashboard/commissions`
📍 Back: `/api/commissions`

### Backend

- Calcular comisión por cada payment
- Debe ser consistente con pagos

### Frontend

- Mostrar tabla de comisiones

### Problemas esperados

- nombres distintos (`amount` vs `totalAmount`)
- cálculo incorrecto

---

# 💥 EVENTOS DEL TALLER

Durante la clase, pueden ocurrir cambios:

- “La comisión ahora es 15%”
- “Los pagos deben tener estado ‘failed’”
- “Se duplicaron pagos en producción”

👉 Debes adaptarte sin romper el sistema

---

# 🔄 INTERCAMBIO DE REPOS

Recibirás código de otro equipo.

Tu misión:

- Entenderlo rápidamente
- Detectar errores
- Continuar desarrollo

---

# 🧠 REFLEXIÓN

Responde:

1. ¿Qué parte del backend fue más difícil?
2. ¿Qué problemas viste en el frontend?
3. ¿Los datos eran consistentes?
4. ¿Qué arquetipo apareció en tu equipo?

---

# 🏁 BONUS

Si avanzas rápido:

- Validaciones en backend
- Manejo de errores en frontend
- Refactorizar estructura
- Mejorar UX

---

# ⚠️ IMPORTANTE

Este sistema está **intencionalmente mal diseñado**.

👉 Tu trabajo no es hacerlo perfecto
👉 Es **entender, mejorar y colaborar**

---

# 🚀 Éxito del taller

Se mide por:

✅ integración front + back
✅ manejo de datos
✅ trabajo en equipo
✅ capacidad de adaptación

---

¡Buena suerte! 💥
