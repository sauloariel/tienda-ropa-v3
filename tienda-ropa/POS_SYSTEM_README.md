# 🏪 Sistema POS - Supermercado

## Descripción

El Sistema POS (Point of Sale) es una aplicación completa para gestionar ventas en un supermercado. Permite a los empleados procesar ventas rápidamente, gestionar inventario y generar reportes.

## 🚀 Características Principales

### Sistema de Venta
- **Interfaz intuitiva**: Diseñada para uso rápido en caja registradora
- **Búsqueda rápida**: Encuentra productos por nombre o categoría
- **Gestión de carrito**: Agrega, modifica y elimina productos fácilmente
- **Múltiples métodos de pago**: Efectivo, tarjeta, transferencia, QR
- **Cálculo automático**: Subtotal, IVA y total con cambio automático

### Gestión de Inventario
- **Stock en tiempo real**: Muestra disponibilidad actualizada
- **Actualización automática**: Reduce stock al procesar ventas
- **Alertas de stock**: Indica productos con stock bajo o agotado

### Reportes y Estadísticas
- **Historial de ventas**: Registro completo de todas las transacciones
- **Estadísticas de ventas**: Métodos de pago más utilizados
- **Productos más vendidos**: Análisis de popularidad
- **Generación de tickets**: Tickets de venta formateados

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** con TypeScript
- **Tailwind CSS** para estilos
- **Axios** para comunicación con API
- **React Hooks** para gestión de estado

### Backend
- **Node.js** con Express
- **TypeScript** para tipado estático
- **SQLite** como base de datos
- **Sequelize** como ORM
- **Express Validator** para validación

## 📱 Interfaz de Usuario

### Vista Principal del POS
```
┌─────────────────────────────────────────────────────────────┐
│                    🏪 Sistema POS - Supermercado           │
│                         Punto de Venta                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────┐ ┌─────────────────────┐
│        🛍️ Productos            │ │    🛒 Carrito       │
│                                 │ │                     │
│ [🔍 Buscar productos...]       │ │ Total: $0.00       │
│                                 │ │                     │
│ ┌─────┐ ┌─────┐ ┌─────┐        │ │ 💳 Finalizar Venta │
│ │Prod1│ │Prod2│ │Prod3│        │ │ 🗑️ Limpiar         │
│ │$10  │ │$15  │ │$20  │        │ │                     │
│ │Stock│ │Stock│ │Stock│        │ │                     │
│ └─────┘ └─────┘ └─────┘        │ └─────────────────────┘
└─────────────────────────────────┘
```

### Modal de Pago
```
┌─────────────────────────────────────┐
│           💳 Finalizar Venta        │
│         Total: $45.00               │
├─────────────────────────────────────┤
│ Método de Pago:                     │
│ [💵 Efectivo] [💳 Tarjeta]         │
│ [🏦 Transferencia] [📱 QR]         │
│                                     │
│ Monto Recibido: $50.00             │
│ Cambio: $5.00                      │
│                                     │
│ [Cancelar] [Completar Venta]       │
└─────────────────────────────────────┘
```

## 🔧 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd tienda-ropa
```

### 2. Instalar dependencias del frontend
```bash
npm install
```

### 3. Configurar el backend
```bash
cd ../backend_definitivo
npm install
```

### 4. Crear tablas de ventas
```bash
# Ejecutar el script SQL
sqlite3 database.sqlite < create-ventas-tables.sql
```

### 5. Iniciar el backend
```bash
npm run dev
# o
npm start
```

### 6. Iniciar el frontend
```bash
cd ../tienda-ropa
npm run dev
```

## 📊 Estructura de la Base de Datos

### Tabla `ventas`
- `id_venta`: Identificador único de la venta
- `fecha_venta`: Fecha y hora de la venta
- `total`: Monto total de la venta
- `metodo_pago`: Método de pago utilizado
- `cliente_id`: ID del cliente (opcional)
- `empleado_id`: ID del empleado que procesó la venta
- `estado`: Estado de la venta (completada, anulada)

### Tabla `detalle_ventas`
- `id_detalle_venta`: Identificador único del detalle
- `id_venta`: Referencia a la venta principal
- `id_producto`: Referencia al producto vendido
- `cantidad`: Cantidad vendida
- `precio_unitario`: Precio por unidad
- `subtotal`: Subtotal del item

## 🔌 API Endpoints

### Ventas
- `POST /api/ventas` - Crear nueva venta
- `GET /api/ventas` - Obtener todas las ventas
- `GET /api/ventas/:id` - Obtener venta por ID
- `GET /api/ventas/estadisticas` - Obtener estadísticas
- `PUT /api/ventas/:id/anular` - Anular venta

### Productos
- `PUT /api/productos/:id/stock` - Actualizar stock

## 💡 Uso del Sistema

### 1. Iniciar Sesión
- Navegar a la aplicación
- Seleccionar "💰 Sistema POS" en la barra de navegación

### 2. Procesar Venta
- Buscar productos por nombre o categoría
- Hacer clic en "➕ Agregar" para agregar al carrito
- Ajustar cantidades en el carrito si es necesario
- Hacer clic en "💳 Finalizar Venta"

### 3. Seleccionar Método de Pago
- Elegir método de pago (efectivo, tarjeta, etc.)
- Si es efectivo, ingresar monto recibido
- Confirmar la venta

### 4. Completar Transacción
- El sistema registra la venta en la base de datos
- Actualiza automáticamente el stock
- Genera un ticket de venta
- Limpia el carrito para la siguiente venta

## 🎯 Funciones Avanzadas

### Gestión de Stock
- **Verificación automática**: Previene ventas sin stock
- **Actualización en tiempo real**: Stock se reduce inmediatamente
- **Restauración en anulaciones**: Stock se restaura si se anula la venta

### Reportes
- **Ventas por período**: Filtros por fecha
- **Métodos de pago**: Análisis de preferencias
- **Productos populares**: Top de productos más vendidos

### Seguridad
- **Transacciones**: Uso de transacciones SQL para integridad
- **Validación**: Validación de datos en frontend y backend
- **Logs**: Registro detallado de todas las operaciones

## 🚨 Solución de Problemas

### Error de Conexión al Backend
- Verificar que el backend esté ejecutándose en puerto 4000
- Revisar la configuración CORS
- Verificar la URL de la API en `src/services/api.ts`

### Error de Base de Datos
- Verificar que las tablas estén creadas
- Ejecutar el script SQL de creación de tablas
- Verificar permisos de la base de datos

### Problemas de Stock
- Verificar que los productos tengan stock válido
- Revisar las transacciones de la base de datos
- Verificar logs del backend

## 🔮 Próximas Funcionalidades

- [ ] **Gestión de clientes**: Registro y búsqueda de clientes
- [ ] **Descuentos**: Aplicar descuentos por cliente o producto
- [ ] **Devoluciones**: Proceso de devolución de productos
- [ ] **Impresión**: Impresión física de tickets
- [ ] **Backup**: Sistema de respaldo automático
- [ ] **Múltiples cajas**: Soporte para múltiples puntos de venta

## 📞 Soporte

Para reportar problemas o solicitar nuevas funcionalidades:
- Crear un issue en el repositorio
- Documentar el problema con capturas de pantalla
- Incluir información del sistema operativo y versión

---

**Desarrollado con ❤️ para supermercados modernos**

