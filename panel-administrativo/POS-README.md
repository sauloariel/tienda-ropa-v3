# 🏪 Módulo POS - Panel Administrativo

## 📋 Descripción

El módulo POS (Point of Sale) del panel administrativo permite realizar ventas de manera rápida y eficiente, con integración completa con la base de datos y generación automática de facturas.

## ✨ Características Implementadas

### 🎯 Funcionalidades Principales
- **Búsqueda de Productos** - Por nombre y categoría
- **Gestión de Carrito** - Agregar, modificar, eliminar productos
- **Validación de Stock** - Verificación en tiempo real
- **Cálculo Automático** - Subtotal, IVA (21%), Total
- **Métodos de Pago** - Efectivo, Tarjeta, Transferencia, QR
- **Número de Factura Estable** - Hook personalizado para mantener consistencia
- **Generación de Facturas** - Integración completa con backend

### 🔧 Componentes Técnicos

#### Frontend
- **`src/pages/POS.tsx`** - Componente principal del POS
- **`src/hooks/useStableInvoiceNumber.ts`** - Hook para número de factura estable
- **`src/services/factura.ts`** - Servicio de facturación
- **`src/services/productos.ts`** - Servicio de productos
- **`src/types/factura.types.ts`** - Tipos TypeScript

#### Backend
- **`src/controllers/FacturaController.ts`** - Controlador de facturas
- **`src/router/RouterFacturas.ts`** - Rutas de facturas
- **Endpoint `/api/facturas/next-number`** - Obtener siguiente número

## 🚀 Instalación y Uso

### 1. Instalar Dependencias
```bash
cd panel-administrativo
npm install
```

### 2. Configurar Backend
```bash
cd ../backend_definitivo
npm install
npm run dev
```

### 3. Iniciar Frontend
```bash
cd ../panel-administrativo
npm run dev
```

### 4. Probar Integración
```bash
npm run test-pos
```

## 🔧 Configuración

### Variables de Entorno
El backend debe tener configurado:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce
DB_USER=postgres
DB_PASSWORD=123
JWT_SECRET=mi_jwt_secret_super_seguro_para_desarrollo_2024
PORT=4000
```

### API Endpoints
- `GET /api/facturas/next-number` - Obtener siguiente número de factura
- `GET /api/productos` - Obtener productos
- `GET /api/productos/categorias` - Obtener categorías
- `POST /api/facturas` - Crear factura

## 📱 Uso del POS

### 1. Acceder al POS
- Navegar a `/pos` en el panel administrativo
- Requiere rol de 'Admin' o 'Vendedor'

### 2. Realizar una Venta
1. **Buscar Productos** - Usar la barra de búsqueda o filtrar por categoría
2. **Agregar al Carrito** - Hacer clic en el botón "+" del producto
3. **Modificar Cantidades** - Usar los botones +/- en el carrito
4. **Seleccionar Método de Pago** - Elegir entre efectivo, tarjeta, etc.
5. **Finalizar Venta** - Hacer clic en "Finalizar Venta y Facturar"

### 3. Características Avanzadas
- **Número de Factura Estable** - Se mantiene durante toda la sesión
- **Validación de Stock** - Previene ventas sin stock
- **Cálculo Automático de IVA** - 21% incluido automáticamente
- **Interfaz Responsive** - Funciona en desktop y móvil

## 🧪 Testing

### Pruebas Automáticas
```bash
npm run test-pos
```

### Pruebas Manuales
1. Verificar carga de productos
2. Probar búsqueda y filtros
3. Validar cálculo de totales
4. Confirmar generación de facturas

## 🐛 Solución de Problemas

### Error: "No se pudo obtener el número"
- Verificar que el backend esté ejecutándose
- Comprobar conexión a la base de datos
- Revisar logs del servidor

### Error: "Productos no se cargan"
- Verificar endpoint `/api/productos`
- Comprobar configuración de CORS
- Revisar logs del navegador

### Error: "Error al crear factura"
- Verificar stock de productos
- Comprobar datos de la factura
- Revisar logs del backend

## 📊 Estructura de Datos

### FacturaRequest
```typescript
interface FacturaRequest {
    productos: Array<{
        id_producto: number;
        cantidad: number;
        precio_unitario: number;
        subtotal: number;
    }>;
    total: number;
    metodo_pago: string;
    cliente_id?: number;
}
```

### useStableInvoiceNumber Hook
```typescript
const { value, loading, error } = useStableInvoiceNumber();
// value: string | null - Número de factura
// loading: boolean - Estado de carga
// error: string | null - Error si existe
```

## 🔄 Flujo de Datos

1. **Carga Inicial** - Hook obtiene número de factura
2. **Búsqueda** - Usuario busca productos
3. **Carrito** - Productos se agregan al carrito
4. **Validación** - Se verifica stock disponible
5. **Cálculo** - Se calculan totales automáticamente
6. **Facturación** - Se crea la factura en el backend
7. **Actualización** - Se actualiza stock de productos

## 🎨 Interfaz de Usuario

### Diseño
- **Layout Responsive** - Adaptable a diferentes pantallas
- **Colores Consistentes** - Paleta azul y gris
- **Iconos Lucide** - Iconografía moderna
- **Animaciones Suaves** - Transiciones fluidas

### Componentes
- **Barra de Búsqueda** - Filtrado en tiempo real
- **Lista de Productos** - Cards con información completa
- **Carrito de Compras** - Tabla con controles de cantidad
- **Resumen de Totales** - Cálculos automáticos
- **Botones de Acción** - Controles intuitivos

## 📈 Próximas Mejoras

- [ ] Integración con códigos de barras
- [ ] Modo offline
- [ ] Reportes en tiempo real
- [ ] Integración con impresoras
- [ ] Gestión de clientes integrada
- [ ] Descuentos y promociones

## 🤝 Contribución

Para contribuir al módulo POS:
1. Fork el repositorio
2. Crea una rama para tu feature
3. Implementa las mejoras
4. Ejecuta las pruebas
5. Crea un pull request

## 📞 Soporte

Para soporte técnico:
- Revisar logs del sistema
- Verificar configuración de la base de datos
- Comprobar conectividad de red
- Consultar documentación del backend

---

**¡El módulo POS está completamente funcional y listo para producción! 🎉**




