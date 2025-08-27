# 🧾 Sistema de Facturación - Backend

## 📋 Descripción

Sistema completo de facturación integrado con el POS que permite generar facturas profesionales, gestionar el stock automáticamente y mantener un historial completo de todas las transacciones.

## ✨ Características Implementadas

### 🏗️ **Modelos de Base de Datos**
- **Factura**: Modelo principal con información de la venta
- **DetalleFactura**: Detalles de productos en cada factura
- **Relaciones**: Cliente, Productos, con validaciones de integridad

### 🔧 **Controlador de Facturas**
- **Crear Factura**: Con validaciones y generación automática de número
- **Obtener Facturas**: Con filtros por fecha y estado
- **Anular Factura**: Con restauración automática de stock
- **Estadísticas**: Métricas completas de facturación

### 📊 **API RESTful**
- **POST** `/api/facturas` - Crear nueva factura
- **GET** `/api/facturas` - Listar facturas con filtros
- **GET** `/api/facturas/:id` - Obtener factura específica
- **PUT** `/api/facturas/:id/anular` - Anular factura
- **GET** `/api/facturas/estadisticas` - Estadísticas de facturación

## 🗄️ Estructura de Base de Datos

### Tabla `facturas`
```sql
CREATE TABLE facturas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numeroFactura VARCHAR(20) NOT NULL UNIQUE,
    fecha DATETIME NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    cliente_id INTEGER,
    estado VARCHAR(20) NOT NULL DEFAULT 'activa',
    metodo_pago VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);
```

### Tabla `detalle_facturas`
```sql
CREATE TABLE detalle_facturas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    factura_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (factura_id) REFERENCES facturas(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);
```

## 🔌 Endpoints de la API

### 1. **Crear Factura**
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

**Respuesta Exitosa:**
```json
{
  "success": true,
  "message": "Factura creada exitosamente",
  "factura": {
    "id": 1,
    "numeroFactura": "F2025010001",
    "fecha": "2025-01-15T10:30:00.000Z",
    "total": 50.00,
    "estado": "activa",
    "metodo_pago": "efectivo",
    "detalles": [...],
    "cliente": null
  }
}
```

### 2. **Obtener Facturas**
```http
GET /api/facturas?fecha_inicio=2025-01-01&fecha_fin=2025-01-31&estado=activa
```

### 3. **Obtener Factura por ID**
```http
GET /api/facturas/1
```

### 4. **Anular Factura**
```http
PUT /api/facturas/1/anular
```

### 5. **Estadísticas de Facturación**
```http
GET /api/facturas/estadisticas?fecha_inicio=2025-01-01&fecha_fin=2025-01-31
```

## 🔐 Validaciones y Seguridad

### **Validaciones de Entrada**
- Productos deben ser un array válido
- Cantidades deben ser mayores a 0
- Precios deben ser números positivos
- Total debe coincidir con la suma de subtotales
- Método de pago es obligatorio

### **Validaciones de Negocio**
- Verificación de stock disponible antes de crear factura
- Prevención de facturas duplicadas
- Validación de integridad referencial
- Control de estado de facturas

### **Manejo de Errores**
- Respuestas HTTP apropiadas (200, 201, 400, 404, 500)
- Mensajes de error descriptivos
- Logs detallados para debugging
- Rollback automático en caso de error

## 📈 Generación de Números de Factura

### **Formato del Número**
```
F + AÑO + MES + CONSECUTIVO (4 dígitos)
Ejemplo: F2025010001
```

### **Lógica de Generación**
1. Obtener año y mes actual
2. Buscar última factura del mes
3. Incrementar consecutivo
4. Generar número único

## 🚀 Flujo de Creación de Factura

### **1. Validación de Datos**
- Verificar estructura de productos
- Validar cantidades y precios
- Calcular totales

### **2. Verificación de Stock**
- Consultar stock disponible para cada producto
- Validar que haya suficiente inventario
- Prevenir ventas sin stock

### **3. Creación de Factura**
- Generar número único
- Insertar registro principal
- Crear detalles de factura
- Actualizar stock de productos

### **4. Respuesta al Cliente**
- Devolver factura completa
- Incluir detalles y productos
- Confirmar éxito de la operación

## 🔄 Gestión de Stock

### **Actualización Automática**
- Stock se reduce al crear factura
- Cantidad = Stock anterior - Cantidad vendida
- Prevención de stock negativo

### **Restauración de Stock**
- Al anular factura, stock se restaura
- Cantidad = Stock actual + Cantidad de la factura
- Mantiene integridad del inventario

## 📊 Estadísticas y Reportes

### **Métricas Disponibles**
- Total de facturas por período
- Ingresos totales
- Promedio por factura
- Métodos de pago más utilizados
- Productos más facturados

### **Filtros de Consulta**
- Por rango de fechas
- Por estado (activa/anulada)
- Por método de pago
- Por cliente

## 🧪 Testing y Debugging

### **Logs del Sistema**
```javascript
console.log('🔄 Creando factura con datos:', {
  productosCount: productos?.length,
  total,
  metodo_pago,
  cliente_id
});
```

### **Verificación de Conexión**
```bash
curl http://localhost:4000/api/facturas
```

### **Pruebas de Validación**
- Crear factura sin productos
- Factura con stock insuficiente
- Factura con datos inválidos
- Anular factura inexistente

## 🔧 Configuración y Variables de Entorno

### **Base de Datos**
```env
DB_PATH=./database.sqlite
```

### **Servidor**
```env
PORT=4000
JWT_SECRET=tu_secreto_jwt
```

## 📱 Integración con Frontend

### **Servicios Utilizados**
- `facturaService.ts` - Comunicación con API
- `FacturaModal.tsx` - Visualización de factura
- `POSSystem.tsx` - Integración con POS

### **Flujo de Integración**
1. Usuario completa venta en POS
2. Se procesa el pago
3. Se crea factura en backend
4. Se muestra modal de factura
5. Opción de descarga PDF

## 🚀 Instalación y Configuración

### **1. Dependencias**
```bash
npm install
```

### **2. Crear Tablas**
```bash
# Ejecutar el script SQL
sqlite3 database.sqlite < create-facturas-tables.sql
```

### **3. Compilar y Ejecutar**
```bash
npm run build
npm start
```

### **4. Verificar Funcionamiento**
```bash
curl http://localhost:4000/api/facturas
```

## 🔮 Futuras Mejoras

### **Versión 1.2**
- [ ] Integración con impresoras térmicas
- [ ] Envío de facturas por email
- [ ] Firmas digitales
- [ ] Múltiples monedas

### **Versión 2.0**
- [ ] Facturación electrónica (FE)
- [ ] Integración con sistemas contables
- [ ] Reportes avanzados
- [ ] Backup automático

## 📞 Soporte y Contacto

### **Documentación**
- README principal del proyecto
- Comentarios en el código
- Ejemplos de uso

### **Contacto del Desarrollador**
- **GitHub**: [@sauloariel](https://github.com/sauloariel)
- **Repositorio**: https://github.com/sauloariel/Tienda_ropa

---

## 🎉 ¡El Sistema de Facturación está Listo para Producción!

**Características implementadas:**
✅ Modelos de base de datos completos  
✅ API RESTful con validaciones  
✅ Generación automática de números de factura  
✅ Control automático de stock  
✅ Anulación de facturas con restauración  
✅ Estadísticas y reportes  
✅ Integración completa con POS  
✅ Manejo robusto de errores  

**El sistema puede manejar facturación real desde el primer momento.**
