# 🏪 Sistema POS con Facturación Integrada

## 📋 Descripción

Sistema completo de punto de venta (POS) con facturación automática integrada. Permite realizar ventas, generar facturas profesionales y gestionar el inventario en tiempo real.

## ✨ **Funcionalidades del Sistema POS**

### 🛍️ **Gestión de Productos**
- Grid visual de productos con imágenes
- Filtros por categoría y búsqueda por nombre
- Información completa: precio, stock, descripción
- Indicadores visuales de disponibilidad

### 🛒 **Carrito de Compras**
- Agregar/remover productos
- Ajustar cantidades
- Cálculo automático de subtotales e IVA
- Vista previa de la venta

### 💳 **Procesamiento de Pagos**
- Múltiples métodos de pago:
  - 💵 Efectivo
  - 💳 Tarjeta
  - 🏦 Transferencia
  - 📱 QR/Pago Móvil
- Validación de stock en tiempo real
- Cálculo automático de cambio

### 🧾 **Sistema de Facturación**
- **Generación automática** de facturas
- **Números únicos** consecutivos por mes
- **Control de stock** automático
- **Modal profesional** de factura
- **Descarga de PDF** con html2pdf.js
- **Impresión directa** desde el navegador

## 🚀 **Inicio Rápido**

### **Opción 1: Script Automático (Recomendado)**
```bash
# Windows
start-pos-facturacion.bat

# Linux/Mac
./start-pos-facturacion.sh
```

### **Opción 2: Inicio Manual**
```bash
# Terminal 1 - Backend
cd backend_definitivo
npm run dev

# Terminal 2 - Frontend
cd tienda-ropa
npm run dev
```

### **Opción 3: Solo Backend (Para desarrollo)**
```bash
cd backend_definitivo
npm run dev
```

## 🎯 **Flujo de Facturación**

### **1. Selección de Productos**
```
Usuario → POS → Agregar al Carrito → Ver Carrito
```

### **2. Finalización de Venta**
```
Carrito → "Finalizar Venta" → Modal de Pago → Seleccionar Método
```

### **3. Generación de Factura**
```
Pago Confirmado → Backend crea factura → Modal de Factura → Opciones:
├── 📄 Imprimir
├── 📥 Descargar PDF
└── ❌ Cerrar
```

## 🔧 **Configuración del Sistema**

### **Backend (Puerto 4000)**
- **Base de datos**: SQLite con tablas de facturas
- **API RESTful**: Endpoints para gestión completa
- **Validaciones**: Stock, datos de entrada, integridad
- **Logs**: Trazabilidad completa de operaciones

### **Frontend (Puerto 5173)**
- **React 18** con TypeScript
- **Tailwind CSS** para diseño responsivo
- **Axios** para comunicación con API
- **html2pdf.js** para generación de PDFs

## 📊 **Características de Facturación**

### **Generación Automática**
- Números consecutivos: `F2025010001`, `F2025010002`
- Fecha y hora automática
- Cálculo de totales con IVA
- Validación de stock disponible

### **Contenido de Factura**
- **Encabezado**: Número, fecha, estado
- **Cliente**: Información completa (si aplica)
- **Productos**: Detalle con cantidades y precios
- **Totales**: Subtotal, IVA, total final
- **Método de pago** y estado

### **Opciones de Salida**
- **Impresión**: Directa desde navegador
- **PDF**: Descarga automática con nombre único
- **Vista previa**: Modal profesional antes de procesar

## 🔌 **API Endpoints de Facturación**

### **Crear Factura**
```http
POST /api/facturas
Content-Type: application/json

{
  "productos": [
    {
      "id_producto": 1,
      "cantidad": 2,
      "precio_unitario": 25.00,
      "subtotal": 50.00
    }
  ],
  "total": 50.00,
  "metodo_pago": "efectivo",
  "cliente_id": null
}
```

### **Obtener Facturas**
```http
GET /api/facturas
GET /api/facturas?fecha_inicio=2025-01-01&fecha_fin=2025-01-31
GET /api/facturas?estado=activa
```

### **Estadísticas**
```http
GET /api/facturas/estadisticas
GET /api/facturas/estadisticas?fecha_inicio=2025-01-01&fecha_fin=2025-01-31
```

### **Anular Factura**
```http
PUT /api/facturas/:id/anular
```

## 🧪 **Pruebas del Sistema**

### **Script de Prueba Automática**
```bash
cd backend_definitivo
node test-facturas.js
```

### **Pruebas Manuales**
1. **Crear factura**: Usar el POS para generar una venta
2. **Verificar stock**: Confirmar que se actualiza automáticamente
3. **Descargar PDF**: Verificar generación de factura
4. **Anular factura**: Probar restauración de stock

## 📱 **Interfaz de Usuario**

### **Componentes Principales**
- **`POSSystem.tsx`**: Sistema principal de punto de venta
- **`ProductGrid.tsx`**: Grid de productos para selección
- **`Cart.tsx`**: Carrito de compras con totales
- **`PaymentModal.tsx`**: Procesamiento de pagos
- **`FacturaModal.tsx`**: Visualización y descarga de facturas

### **Estados del Sistema**
- **Carga**: Indicadores de progreso
- **Procesamiento**: Estados de facturación
- **Éxito**: Confirmación de operaciones
- **Error**: Manejo robusto de fallos

## 🔒 **Seguridad y Validaciones**

### **Frontend**
- Validación de cantidades positivas
- Verificación de stock disponible
- Campos obligatorios completos
- Formato de datos correcto

### **Backend**
- Validación de entrada con express-validator
- Verificación de stock antes de crear factura
- Prevención de facturas duplicadas
- Manejo de transacciones de base de datos

## 📈 **Monitoreo y Logs**

### **Logs del Sistema**
```javascript
console.log('🔄 Creando factura con datos:', {
  productosCount: productos?.length,
  total,
  metodo_pago,
  cliente_id
});
```

### **Métricas Disponibles**
- Total de facturas por período
- Ingresos totales
- Promedio por factura
- Métodos de pago más utilizados
- Productos más facturados

## 🚨 **Solución de Problemas**

### **Error: "Backend no responde"**
```bash
# Verificar que el backend esté ejecutándose
curl http://localhost:4000/api/facturas

# Revisar logs del backend
cd backend_definitivo
npm run dev
```

### **Error: "Stock insuficiente"**
- Verificar que los productos tengan stock > 0
- Revisar la base de datos directamente
- Verificar que no haya ventas pendientes

### **Error: "No se puede generar PDF"**
- Verificar que html2pdf.js esté instalado
- Revisar la consola del navegador
- Verificar permisos de descarga

## 🔮 **Futuras Mejoras**

### **Versión 1.2**
- [ ] Escáner de códigos de barras
- [ ] Impresora térmica integrada
- [ ] Múltiples monedas
- [ ] Descuentos y promociones

### **Versión 2.0**
- [ ] App móvil nativa
- [ ] Sincronización offline
- [ ] Integración con pasarelas de pago
- [ ] Sistema de fidelización

## 📞 **Soporte y Contacto**

### **Documentación Relacionada**
- `README.md` - Documentación principal del proyecto
- `POS_SYSTEM_README.md` - Guía del sistema POS
- `FACTURACION_README.md` - Documentación de facturación

### **Contacto del Desarrollador**
- **GitHub**: [@sauloariel](https://github.com/sauloariel)
- **Repositorio**: https://github.com/sauloariel/Tienda_ropa

---

## 🎉 **¡El Sistema POS con Facturación está Listo para Producción!**

**Características implementadas:**
✅ Sistema POS completo con interfaz de supermercado  
✅ Facturación automática integrada  
✅ Generación de PDFs profesionales  
✅ Control automático de stock  
✅ API RESTful completa  
✅ Interfaz moderna y responsiva  
✅ Validaciones robustas  
✅ Logs y monitoreo completo  

**El sistema puede manejar ventas reales con facturación profesional desde el primer momento.**
