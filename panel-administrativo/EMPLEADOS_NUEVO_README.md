# 🆕 Sistema de Creación de Empleados

## 📋 **Resumen del Sistema**

Se ha implementado un sistema completo para crear empleados con validaciones robustas, siguiendo exactamente las especificaciones del backend.

## 🏗️ **Archivos Creados/Modificados**

### **1. `src/services/empleados.ts`**
- **Tipo**: `EmpleadoCreate` con todos los campos requeridos
- **Función**: `crearEmpleado()` que llama a `POST /empleados`
- **Uso**: Instancia de axios existente (`api`)

### **2. `src/pages/EmpleadosNuevo.tsx`**
- **Formulario completo** con react-hook-form + valibot
- **Validaciones en tiempo real** según reglas del backend
- **UI/UX moderna** con Tailwind CSS
- **Accesibilidad completa** (aria-labels, focus management)

### **3. `src/App.tsx`**
- **Nueva ruta**: `/empleados/nuevo`
- **Protección**: Solo usuarios con acceso a módulo empleados
- **Integración**: Sin modificar otras rutas existentes

### **4. `src/pages/Empleados.tsx`**
- **Botón "Nuevo Empleado"** que navega a `/empleados/nuevo`
- **Mantiene funcionalidad existente** del modal

## 🔐 **Validaciones Implementadas**

### **Campos Requeridos**
- ✅ **CUIL**: Exactamente 11 dígitos (solo números)
- ✅ **Nombre**: String requerido
- ✅ **Apellido**: String requerido
- ✅ **Domicilio**: String requerido
- ✅ **Teléfono**: String requerido
- ✅ **Email**: Email válido

### **Campos Opcionales**
- ✅ **Sueldo**: Número >= 0 (parseado a number)
- ✅ **Puesto**: String opcional
- ✅ **Estado**: Select con opciones (activo, inactivo, baja)

### **Reglas de Validación**
```typescript
// Esquema de validación con valibot
export const empleadoSchema = object({
  cuil: pipe(
    string([minLength(11), maxLength(11)]),
    transform((v) => SoloDigitos(v))
  ),
  nombre: pipe(string(), minLength(1, 'Nombre requerido')),
  apellido: pipe(string(), minLength(1, 'Apellido requerido')),
  domicilio: pipe(string(), minLength(1, 'Domicilio requerido')),
  telefono: pipe(string(), minLength(1, 'Teléfono requerido')),
  mail: pipe(string(), email('Email inválido')),
  sueldo: optional(pipe(string(), transform((v) => Number(v)))),
  puesto: optional(string()),
  estado: optional(pipe(string(), maxLength(8)))
});
```

## 🎨 **Características de UI/UX**

### **Layout y Diseño**
- **Centrado**: `max-w-4xl mx-auto p-4`
- **Card**: `bg-white rounded-2xl shadow p-6`
- **Grid**: 2 columnas en desktop, 1 en móvil
- **Responsive**: Adaptativo a todos los tamaños

### **Estilos Tailwind**
- **Inputs**: `block w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring`
- **Botones**: 
  - Guardar: `bg-blue-600 text-white hover:bg-blue-700`
  - Cancelar: `border border-gray-300 text-gray-700 hover:bg-gray-50`
- **Errores**: `text-sm text-red-600 mt-1`

### **Accesibilidad**
- ✅ **Labels**: `htmlFor` en todos los campos
- ✅ **ARIA**: `aria-invalid`, `aria-describedby`
- ✅ **Focus**: `focus:ring-2 focus:ring-blue-500`
- ✅ **Navegación**: Teclado y mouse

## 🔄 **Flujo de Trabajo**

### **1. Acceso al Formulario**
- Usuario hace clic en "Nuevo Empleado" en la lista de empleados
- Navega a `/empleados/nuevo`
- Sistema verifica permisos (solo admin puede acceder)

### **2. Llenado del Formulario**
- **Validación en tiempo real** mientras se escribe
- **Formateo automático** de CUIL (solo números)
- **Formateo automático** de teléfono (0-9, (), -, +, espacio)
- **Mensajes de error** claros y específicos

### **3. Envío del Formulario**
- **Normalización de datos**:
  - Trim de strings
  - Conversión de sueldo a number
  - Sanitización de CUIL y teléfono
- **Llamada a API**: `POST /empleados`
- **Manejo de respuestas**: Toast de éxito/error

### **4. Navegación**
- **Éxito**: Toast "Empleado creado" + navegación a `/empleados`
- **Error**: Toast con mensaje del backend
- **Cancelar**: Navegación de vuelta a `/empleados`

## 🧪 **Testing del Sistema**

### **Escenarios de Prueba**

#### **1. Validaciones de Campos**
- ✅ CUIL con menos de 11 dígitos → Error
- ✅ CUIL con más de 11 dígitos → Error
- ✅ CUIL con letras → Error
- ✅ Email inválido → Error
- ✅ Campos requeridos vacíos → Error

#### **2. Formateo Automático**
- ✅ CUIL: "20-12345678-9" → "20123456789"
- ✅ Teléfono: "+54 (11) 1234-5678" → "+54 (11) 1234-5678"
- ✅ Sueldo: "3,500.50" → 3500.5

#### **3. Navegación**
- ✅ Botón "Nuevo Empleado" → Navega a `/empleados/nuevo`
- ✅ Botón "Cancelar" → Vuelve a `/empleados`
- ✅ Éxito → Vuelve a `/empleados` con toast

### **Credenciales de Prueba**
```bash
# Solo usuarios admin pueden acceder
Usuario: admin
Contraseña: admin
```

## 🔧 **Configuración Técnica**

### **Dependencias Instaladas**
```json
{
  "react-hook-form": "^7.x.x",
  "@hookform/resolvers": "^3.x.x",
  "valibot": "^0.x.x",
  "react-toastify": "^9.x.x"
}
```

### **Integración con Sistema Existente**
- ✅ **AuthContext**: Usa `canAccessModule('empleados')`
- ✅ **API Service**: Usa instancia `api` existente
- ✅ **Routing**: Integrado con sistema de roles
- ✅ **Estilos**: Consistente con Tailwind del proyecto

## 🚨 **Manejo de Errores**

### **Errores de Validación**
- **Cliente**: Mostrados en tiempo real bajo cada campo
- **Mensajes**: Específicos y en español
- **Prevención**: No se envía formulario con errores

### **Errores de API**
- **Backend**: Mensaje del servidor en toast de error
- **Fallback**: Mensaje genérico si no hay respuesta del backend
- **Logging**: Errores registrados en consola para debugging

### **Errores de Permisos**
- **Redirección**: Usuarios sin permisos van al dashboard
- **Protección**: Ruta protegida a nivel de componente y routing

## 📱 **Responsive Design**

### **Breakpoints**
- **Mobile**: 1 columna, inputs apilados
- **Tablet**: 1 columna, inputs apilados
- **Desktop**: 2 columnas, grid layout

### **Adaptaciones**
- **Inputs**: Ancho completo en todos los tamaños
- **Botones**: Stack vertical en móvil, horizontal en desktop
- **Espaciado**: Consistente en todos los breakpoints

## 🔮 **Próximas Mejoras**

- [ ] **Autocompletado** de campos comunes
- [ ] **Validación de CUIL** (algoritmo de verificación)
- [ ] **Carga de archivos** (foto del empleado)
- [ ] **Plantillas** para empleados frecuentes
- [ ] **Importación masiva** desde Excel/CSV
- [ **Historial** de cambios y auditoría

---

**Sistema desarrollado siguiendo las mejores prácticas de React, TypeScript y UX** 🚀✨

