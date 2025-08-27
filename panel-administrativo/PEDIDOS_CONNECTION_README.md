# Módulo de Pedidos - Conexión Frontend-Backend

## ✅ Estado de la Conexión

El módulo de Pedidos está **completamente conectado** al backend y listo para usar.

## 🔗 Archivos Conectados

### Backend (Node.js + Express + Sequelize)
- `backend_definitivo/src/controllers/PedidosController.ts` - Controlador REST
- `backend_definitivo/src/router/RouterPedidos.ts` - Rutas de la API
- `backend_definitivo/src/models/Pedidos.model.ts` - Modelo Sequelize
- `backend_definitivo/test-pedidos.js` - Script de prueba

### Frontend (React + TypeScript)
- `panel-administrativo/src/pages/Pedidos.tsx` - Página principal
- `panel-administrativo/src/services/pedidos.ts` - Servicio de API
- `panel-administrativo/src/services/api.ts` - Cliente HTTP

## 🚀 Cómo Usar

### 1. Iniciar el Backend
```bash
cd backend_definitivo
npm run dev
```

El servidor se ejecutará en `http://localhost:4000`

### 2. Iniciar el Frontend
```bash
cd panel-administrativo
npm run dev
```

El frontend se ejecutará en `http://localhost:5173`

### 3. Navegar a Pedidos
- Ir a `/pedidos` en el frontend
- Los pedidos se cargarán automáticamente desde el backend
- Usar filtros y búsqueda
- Anular pedidos con el botón de papelera

## 🔧 Funcionalidades Implementadas

### ✅ Completadas
- **Listar pedidos**: GET `/api/pedidos`
- **Ver pedido**: GET `/api/pedidos/:id`
- **Crear pedido**: POST `/api/pedidos`
- **Anular pedido**: PUT `/api/pedidos/anular/:id`
- **Filtros**: Por estado y búsqueda de texto
- **Estadísticas**: Total, pendientes, valor total
- **Manejo de errores**: Loading states y mensajes de error

### 🔄 Pendientes (Futuras Versiones)
- Editar pedidos existentes
- Paginación avanzada
- Filtros por fecha
- Exportar pedidos
- Historial de cambios

## 📊 Estructura de Datos

### Pedido (Backend)
```typescript
{
  id_pedido: number
  id_cliente: number
  id_empleados: number
  fecha_pedido: Date
  importe: number
  estado: string
  anulacion: boolean
  venta_web: boolean
  payment_id?: string
  cliente?: Cliente
  detalle?: PedidoDetalle[]
}
```

### Pedido (Frontend)
```typescript
{
  id_pedido: number
  id_cliente: number
  id_empleados: number
  fecha_pedido: string
  importe: number
  estado: string
  anulacion: boolean
  venta_web: boolean
  payment_id?: string
  cliente?: {
    nombre: string
    apellido: string
    mail: string
  }
  detalle?: PedidoDetalle[]
}
```

## 🧪 Probar la API

### Usar el Script de Prueba
```bash
cd backend_definitivo
node test-pedidos.js
```

### Probar Manualmente
```bash
# Obtener todos los pedidos
curl http://localhost:4000/api/pedidos

# Obtener pedido específico
curl http://localhost:4000/api/pedidos/1

# Crear pedido de prueba
curl -X POST http://localhost:4000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "id_cliente": 1,
    "id_empleados": 1,
    "detalle": [
      {
        "id_producto": 1,
        "cantidad": 2,
        "precio_venta": 29.99
      }
    ]
  }'
```

## 🎯 Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/pedidos` | Listar todos los pedidos |
| GET | `/api/pedidos/:id` | Obtener pedido por ID |
| POST | `/api/pedidos` | Crear nuevo pedido |
| PUT | `/api/pedidos/anular/:id` | Anular pedido |

## 🔍 Filtros y Búsqueda

### Búsqueda de Texto
- Busca en: nombre del cliente, email, ID del pedido
- Búsqueda en tiempo real

### Filtros por Estado
- Todos los estados
- Pendiente
- Procesando
- Completado
- Cancelado

## 🚨 Manejo de Errores

### Frontend
- Estados de loading
- Mensajes de error descriptivos
- Botón de reintentar
- Validación de formularios

### Backend
- Try/catch en todas las operaciones
- Respuestas de error estructuradas
- Logging de errores
- Códigos de estado HTTP apropiados

## 📱 Interfaz de Usuario

### Características
- Diseño responsive
- Tabla con ordenamiento
- Iconos intuitivos
- Estados visuales claros
- Acciones contextuales

### Componentes
- Estadísticas en tarjetas
- Barra de búsqueda
- Filtros desplegables
- Tabla de pedidos
- Botones de acción

## 🔧 Configuración

### Variables de Entorno
```env
# Backend
DATABASE_URL=postgresql://usuario:password@localhost:5432/nombre_bd

# Frontend
VITE_API_BASE_URL=http://localhost:4000/api
```

### Dependencias
```json
// Backend
{
  "sequelize": "^6.37.3",
  "express": "^4.19.2",
  "pg": "^8.12.0"
}

// Frontend
{
  "axios": "^1.6.0",
  "react": "^18.2.0",
  "typescript": "^5.0.0"
}
```

## 🎉 ¡Listo para Usar!

El módulo de Pedidos está completamente funcional y conectado. Puedes:

1. **Ver pedidos** en tiempo real desde la base de datos
2. **Crear nuevos pedidos** con detalles
3. **Anular pedidos** existentes
4. **Filtrar y buscar** pedidos
5. **Ver estadísticas** actualizadas

¡Todo funciona sin modificar la base de datos existente!

