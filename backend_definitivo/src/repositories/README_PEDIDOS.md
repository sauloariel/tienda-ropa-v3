# Módulo de Pedidos - Documentación

## Descripción
Este módulo proporciona una API completa para gestionar pedidos en el sistema, conectándose a la base de datos existente sin modificar su esquema.

## Características
- ✅ **Sin modificaciones a la BD**: No se crean/alteran tablas ni se ejecutan migraciones
- ✅ **Mapeo de columnas**: Ajusta automáticamente si los nombres difieren
- ✅ **Repositorio centralizado**: Todo el acceso a datos está en `PedidosRepository`
- ✅ **Filtros avanzados**: Búsqueda, estado, fechas y paginación
- ✅ **Tipado completo**: TypeScript con interfaces bien definidas
- ✅ **Manejo de errores**: Try/catch con respuestas estructuradas
- ✅ **Validaciones**: Express-validator para entradas

## Estructura de Archivos

```
src/
├── models/
│   └── Pedidos.model.ts          # Modelo Sequelize (sin alterar BD)
├── repositories/
│   └── PedidosRepository.ts      # Acceso centralizado a datos
├── controllers/
│   └── PedidosController.ts      # Lógica de negocio y endpoints
├── router/
│   └── RouterPedidos.ts          # Definición de rutas
└── types/
    └── pedidos.types.ts          # Interfaces TypeScript
```

## Endpoints Disponibles

### GET /api/pedidos
Obtiene todos los pedidos con filtros y paginación.

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Elementos por página (default: 10, max: 100)
- `search` (opcional): Búsqueda en nombre, email del cliente o ID del pedido
- `estado` (opcional): Filtro por estado exacto
- `fechaDesde` (opcional): Fecha de inicio (ISO 8601)
- `fechaHasta` (opcional): Fecha de fin (ISO 8601)

**Ejemplo:**
```bash
GET /api/pedidos?page=1&limit=20&search=Juan&estado=Pendiente
```

### GET /api/pedidos/:id
Obtiene un pedido específico por ID.

### POST /api/pedidos
Crea un nuevo pedido con detalles.

**Body:**
```json
{
  "id_cliente": 1,
  "id_empleados": 1,
  "payment_id": "pay_123",
  "detalle": [
    {
      "id_producto": 1,
      "cantidad": 2,
      "precio_venta": 29.99
    }
  ],
  "importe": 59.98,
  "estado": "Pendiente"
}
```

### PUT /api/pedidos/:id
Actualiza un pedido existente.

**Body (campos opcionales):**
```json
{
  "estado": "Completado",
  "importe": 65.00,
  "anulacion": false,
  "venta_web": true
}
```

### DELETE /api/pedidos/:id
Elimina un pedido (borrado lógico si existe columna `anulacion`).

### PUT /api/pedidos/anular/:id
Anula un pedido cambiando su estado a "Cancelado".

### GET /api/pedidos/stats/summary
Obtiene estadísticas generales de pedidos.

## Mapeo de Columnas

El repositorio usa constantes para mapear nombres de columnas. Si tu BD tiene nombres diferentes, ajusta estas constantes en `PedidosRepository.ts`:

```typescript
const COLUMN_MAPPING = {
  PEDIDOS: {
    TABLE: 'pedidos',
    ID: 'id_pedido',
    CLIENTE: 'id_cliente',
    EMPLEADO: 'id_empleados',
    FECHA: 'fecha_pedido',
    IMPORTE: 'importe',
    ESTADO: 'estado',
    ANULACION: 'anulacion',
    VENTA_WEB: 'venta_web',
    PAYMENT_ID: 'payment_id'
  },
  CLIENTES: {
    TABLE: 'clientes',
    ID: 'id_cliente',
    NOMBRE: 'nombre',
    MAIL: 'mail'
  }
};
```

## Estados de Pedido

Los pedidos pueden tener los siguientes estados:
- `Pendiente`: Pedido creado, pendiente de procesamiento
- `Procesando`: Pedido en proceso de preparación
- `Completado`: Pedido finalizado exitosamente
- `Cancelado`: Pedido cancelado/anulado

## Respuestas de la API

Todas las respuestas siguen este formato:

**Éxito:**
```json
{
  "success": true,
  "data": [...],
  "message": "Operación exitosa"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Descripción del error",
  "message": "Mensaje adicional"
}
```

## Filtros y Búsqueda

### Búsqueda de Texto
La búsqueda se realiza en:
- Nombre del cliente
- Email del cliente  
- ID del pedido (convertido a texto)

### Filtros de Fecha
- `fechaDesde`: Incluye pedidos desde esta fecha
- `fechaHasta`: Incluye pedidos hasta esta fecha
- Formato: ISO 8601 (YYYY-MM-DD)

### Paginación
- `page`: Número de página (comienza en 1)
- `limit`: Elementos por página (máximo 100)
- Respuesta incluye: `total`, `page`, `limit`, `totalPages`

## Manejo de Errores

El módulo incluye manejo robusto de errores:
- Validación de entrada con express-validator
- Try/catch en todas las operaciones
- Respuestas de error estructuradas
- Logging de errores en consola
- Códigos de estado HTTP apropiados

## Dependencias

- `sequelize`: ORM para base de datos
- `express-validator`: Validación de entrada
- `pg`: Driver de PostgreSQL

## Configuración

Asegúrate de que tu archivo `.env` contenga:
```env
DATABASE_URL=postgresql://usuario:password@localhost:5432/nombre_bd
```

## Uso en el Frontend

El módulo está listo para ser consumido por el frontend React. Las respuestas incluyen toda la información necesaria para mostrar:
- Lista de pedidos con paginación
- Detalles del pedido
- Información del cliente
- Contador de items
- Estadísticas generales

