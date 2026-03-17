# StreamPanel — Frontend React

Dashboard de administración para gestión de cuentas de streaming.

## Stack
- **React 18** + **Vite**
- **Tailwind CSS** con tokens de diseño personalizados
- **Axios** con proxy a `http://localhost:3001`
- **React Router v6** para navegación
- **react-hot-toast** para notificaciones
- **lucide-react** para iconografía
- Tipografía: **Syne** (display) + **DM Mono** (datos) + **DM Sans** (body)

## Estructura

```
src/
├── App.jsx                          ← Router principal
├── main.jsx                         ← Entry point
├── index.css                        ← Tailwind + componentes globales
├── services/
│   └── api.js                       ← Axios + todos los endpoints
├── utils/
│   └── helpers.js                   ← Formatos, colores, plataformas
└── components/
    ├── layout/
    │   ├── Sidebar.jsx              ← Navegación lateral
    │   └── Layout.jsx               ← Wrapper con Outlet
    ├── ui/
    │   └── index.jsx                ← Modal, Badge, Skeleton, StatCard, etc.
    ├── DashboardPage.jsx            ← Dashboard de inicio
    ├── MessagesPage.jsx             ← Cola de mensajes WhatsApp
    ├── inventory/
    │   ├── InventoryPage.jsx        ← Lista + CRUD de cuentas
    │   └── AccountFormModal.jsx     ← Formulario alta/edición
    ├── customers/
    │   ├── CustomersPage.jsx        ← Lista + CRUD de clientes
    │   └── CustomerFormModal.jsx    ← Formulario alta/edición
    └── sales/
        ├── SalesPage.jsx            ← Ventas + botón "Entregar por WhatsApp"
        └── NewSaleModal.jsx         ← Vincular cliente ↔ cuenta
```

## Setup

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar en desarrollo (proxy → backend en :3001)
npm run dev

# 3. Build para producción
npm run build
```

## Autenticación

El cliente axios adjunta automáticamente el JWT desde `localStorage`:

```js
localStorage.setItem('auth_token', '<tu_token_jwt>')
```

Por ahora la app no incluye pantalla de login — añadir si se requiere.

## Flujo de "Entregar por WhatsApp"

1. Ir a **Ventas**
2. Presionar **"Entregar por WhatsApp"** en cualquier venta activa
3. Se muestra un panel con la preview del mensaje
4. Al confirmar → `POST /api/accounts/:id/send-credentials`
5. El backend desencripta la contraseña y la envía vía **Evolution API**
6. El botón cambia a ✅ Enviado en la sesión actual
