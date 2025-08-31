# 📊 Estados de Pedidos - Sistema Completo

## 🎯 **Estados Disponibles en el Sistema**

### 1. **🟡 Pendiente**
- **Descripción**: Pedido creado pero aún no procesado
- **Color**: Amarillo (`bg-yellow-100 text-yellow-800`)
- **Icono**: Reloj (`Clock`)
- **Acciones disponibles**: Ver, Editar, **Anular**
- **Significado**: El pedido está en espera de ser procesado

### 2. **🔵 Procesando**
- **Descripción**: Pedido en proceso de preparación
- **Color**: Azul (`bg-blue-100 text-blue-800`)
- **Icono**: Reloj (`Clock`)
- **Acciones disponibles**: Ver, Editar, **Anular**
- **Significado**: El pedido está siendo preparado o procesado

### 3. **🟢 Completado**
- **Descripción**: Pedido finalizado exitosamente
- **Color**: Verde (`bg-green-100 text-green-800`)
- **Icono**: Check (`CheckCircle`)
- **Acciones disponibles**: Ver, Editar
- **Acciones NO disponibles**: ❌ Anular
- **Significado**: El pedido ha sido entregado y finalizado

### 4. **🔴 Cancelado**
- **Descripción**: Pedido cancelado por el cliente o sistema
- **Color**: Rojo (`bg-red-100 text-red-800`)
- **Icono**: Alerta (`AlertCircle`)
- **Acciones disponibles**: Ver, Editar
- **Acciones NO disponibles**: ❌ Anular
- **Significado**: El pedido fue cancelado antes de completarse

### 5. **🔴 Anulado**
- **Descripción**: Pedido anulado por el administrador
- **Color**: Rojo (`bg-red-100 text-red-800`)
- **Icono**: Papelera (`Trash2`)
- **Acciones disponibles**: Ver, Editar
- **Acciones NO disponibles**: ❌ Anular
- **Significado**: El pedido fue anulado por el personal

## 🔄 **Flujo de Estados**

```
Pendiente → Procesando → Completado
    ↓           ↓           ↓
  Anular    Anular      ❌ No se puede anular
    ↓           ↓
  Anulado   Anulado
```

## 📋 **Reglas de Negocio**

### **Estados que se pueden ANULAR:**
- ✅ `pendiente`
- ✅ `procesando`

### **Estados que NO se pueden anular:**
- ❌ `completado` (ya finalizado)
- ❌ `cancelado` (ya cancelado)
- ❌ `anulado` (ya anulado)

### **Transiciones permitidas:**
1. **Pendiente** → **Procesando** (cuando se inicia el procesamiento)
2. **Procesando** → **Completado** (cuando se finaliza)
3. **Pendiente** → **Anulado** (cuando se anula)
4. **Procesando** → **Anulado** (cuando se anula)
5. **Cualquier estado** → **Cancelado** (por cancelación del cliente)

## 🎨 **Representación Visual**

### **Colores en la Interfaz:**
- **🟡 Pendiente**: Amarillo suave
- **🔵 Procesando**: Azul suave  
- **🟢 Completado**: Verde suave
- **🔴 Cancelado**: Rojo suave
- **🔴 Anulado**: Rojo suave

### **Iconos en la Interfaz:**
- **🕐 Pendiente**: Reloj
- **🕐 Procesando**: Reloj
- **✅ Completado**: Check
- **⚠️ Cancelado**: Alerta
- **🗑️ Anulado**: Papelera

## 📊 **Estadísticas Mostradas**

El sistema muestra estadísticas para cada estado:

1. **Total Pedidos**: Contador general
2. **Pendientes**: Solo pedidos en espera
3. **Procesando**: Solo pedidos en proceso
4. **Completados**: Solo pedidos finalizados
5. **Cancelados/Anulados**: Combinación de ambos estados
6. **Valor Total**: Suma monetaria de todos los pedidos

## 🔧 **Implementación Técnica**

### **Frontend (React):**
- Filtros por estado
- Validaciones de estado
- Iconos y colores dinámicos
- Estadísticas en tiempo real

### **Backend (Node.js):**
- Validación de transiciones de estado
- Endpoint de anulación
- Persistencia en base de datos
- Logs de cambios de estado

## 🚀 **Uso en la Interfaz**

### **Filtros:**
- Dropdown con todos los estados disponibles
- Búsqueda por texto que incluye estado
- Filtrado en tiempo real

### **Tabla:**
- Columna de estado con colores distintivos
- Iconos representativos de cada estado
- Acciones contextuales según el estado

### **Estadísticas:**
- Tarjetas con contadores por estado
- Colores consistentes con la tabla
- Actualización automática

---

**¡Sistema de estados completo y funcional para gestión de pedidos!** 🎯












