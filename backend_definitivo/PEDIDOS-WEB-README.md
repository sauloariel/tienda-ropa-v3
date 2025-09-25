# Módulo de Pedidos Web

Este módulo permite sincronizar pedidos desde la tienda web hacia el panel administrativo.

## 🚀 Funcionalidades

### Backend (API)
- **Crear pedido individual**: `POST /api/pedidos-web`
- **Sincronizar múltiples pedidos**: `POST /api/pedidos-web/sync`
- **Obtener pedidos web**: `GET /api/pedidos-web`

### Frontend (Panel Administrativo)
- **Página de Pedidos Web**: Gestión completa de pedidos sincronizados
- **Sincronización**: Botón para importar pedidos desde la web
- **Visualización**: Tabla con todos los pedidos web sincronizados

## 📋 Estructura de Datos

### Pedido Web
```typescript
interface PedidoWeb {
  id_cliente: number
  fecha_pedido: string
  importe: number
  estado: string
  payment_id: string
  productos: {
    id_producto: number
    cantidad: number
    precio_venta: number
    descuento?: number
  }[]
}
```

## 🔧 Endpoints de la API

### 1. Crear Pedido Individual
```http
POST /api/pedidos-web
Content-Type: application/json

{
  "id_cliente": 1,
  "fecha_pedido": "2024-01-15T10:30:00.000Z",
  "importe": 150.00,
  "estado": "pendiente",
  "payment_id": "web_123456789",
  "productos": [
    {
      "id_producto": 1,
      "cantidad": 2,
      "precio_venta": 75.00,
      "descuento": 0
    }
  ]
}
```

### 2. Sincronizar Múltiples Pedidos
```http
POST /api/pedidos-web/sync
Content-Type: application/json

{
  "pedidos": [
    {
      "id_cliente": 1,
      "fecha_pedido": "2024-01-15T10:30:00.000Z",
      "importe": 150.00,
      "estado": "pendiente",
      "payment_id": "web_123456789",
      "productos": [...]
    }
  ]
}
```

### 3. Obtener Pedidos Web
```http
GET /api/pedidos-web
```

## 🗄️ Tablas de Base de Datos

### Tabla `pedidos`
- Almacena todos los pedidos (físicos y web)
- Campo `venta_web: true` identifica pedidos web
- Campo `payment_id` almacena referencia del pago web

### Tabla `detalle_pedidos`
- Almacena productos de cada pedido
- Relaciona con `productos` para obtener información completa

## 🔄 Flujo de Sincronización

1. **Tienda Web** → Envía pedido a `/api/pedidos-web`
2. **Backend** → Valida datos y crea pedido en BD
3. **Backend** → Actualiza stock de productos
4. **Panel Admin** → Muestra pedido en módulo de pedidos
5. **Panel Admin** → Permite gestión del pedido

## 🧪 Pruebas

### Script de Simulación
```bash
cd backend_definitivo
node scripts/simulate-web-orders.js
```

### Pruebas Manuales
1. Iniciar servidor backend: `npm run dev`
2. Iniciar panel administrativo: `npm run dev`
3. Ir a página "Pedidos Web"
4. Usar botón "Sincronizar Pedidos"

## 📊 Características del Frontend

### Página Pedidos Web
- **Estadísticas**: Total, completados, pendientes, valor total
- **Tabla**: Lista completa de pedidos web
- **Sincronización**: Botón para importar pedidos
- **Filtros**: Por estado, fecha, cliente

### Integración con Módulo Pedidos
- Los pedidos web aparecen en el módulo principal de pedidos
- Se pueden gestionar igual que pedidos físicos
- Botón "Productos" muestra detalles del cliente

## 🔒 Validaciones

### Backend
- Cliente debe existir
- Productos deben existir y tener stock
- Payment ID debe ser único
- Datos requeridos validados

### Frontend
- Formularios con validación
- Manejo de errores
- Notificaciones de éxito/error

## 🚀 Uso en Producción

### Configuración de la Tienda Web
```javascript
// En la tienda web, al completar pedido:
const pedidoData = {
  id_cliente: clienteId,
  fecha_pedido: new Date().toISOString(),
  importe: total,
  estado: 'pendiente',
  payment_id: paymentId,
  productos: productosCarrito
};

await fetch('http://tu-backend.com/api/pedidos-web', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(pedidoData)
});
```

### Monitoreo
- Logs detallados en backend
- Notificaciones en frontend
- Validación de duplicados por payment_id

## 📈 Beneficios

1. **Sincronización Automática**: Pedidos web se integran automáticamente
2. **Gestión Unificada**: Todos los pedidos en un solo lugar
3. **Trazabilidad**: Seguimiento completo del pedido
4. **Escalabilidad**: Fácil agregar más fuentes de pedidos
5. **Flexibilidad**: Manejo de diferentes estados y tipos de pago

