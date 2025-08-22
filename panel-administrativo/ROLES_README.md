# Sistema de Roles y Permisos - Panel Administrativo

## 🔐 **Estructura de Roles**

El sistema implementa un control de acceso basado en roles (RBAC) con tres niveles de permisos:

### **1. Administrador (id_rol = 1)**
- **Color**: 🔴 Rojo
- **Acceso**: **COMPLETO** a todos los módulos
- **Módulos disponibles**:
  - ✅ Dashboard
  - ✅ Empleados
  - ✅ Productos
  - ✅ Clientes
  - ✅ Pedidos
  - ✅ POS

### **2. Vendedor (id_rol = 2)**
- **Color**: 🔵 Azul
- **Acceso**: **LIMITADO** a módulos de ventas
- **Módulos disponibles**:
  - ✅ Dashboard
  - ✅ Clientes
  - ✅ Pedidos
  - ✅ POS
- **Módulos NO disponibles**:
  - ❌ Empleados
  - ❌ Productos

### **3. Inventario (id_rol = 3)**
- **Color**: 🟢 Verde
- **Acceso**: **MUY LIMITADO** solo a gestión de productos
- **Módulos disponibles**:
  - ✅ Dashboard
  - ✅ Productos
- **Módulos NO disponibles**:
  - ❌ Empleados
  - ❌ Clientes
  - ❌ Pedidos
  - ❌ POS

## 🚀 **Credenciales de Prueba**

### **Para Desarrollo (Mock)**
```bash
# Administrador
Usuario: admin
Contraseña: admin

# Vendedor
Usuario: vendedor
Contraseña: vendedor

# Inventario
Usuario: inventario
Contraseña: inventario
```

### **Para Producción**
El sistema intenta conectarse primero con el backend real usando las credenciales de la base de datos.

## 🏗️ **Implementación Técnica**

### **Contexto de Autenticación**
```typescript
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  isVendedor: boolean
  isInventario: boolean
  canAccessModule: (module: string) => boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}
```

### **Función de Verificación de Módulos**
```typescript
const canAccessModule = (module: string): boolean => {
  if (!user) return false
  
  switch (module) {
    case 'dashboard':
      return true // Todos los usuarios autenticados
    case 'empleados':
      return isAdmin // Solo admin
    case 'productos':
      return isAdmin || isInventario // Admin e inventario
    case 'clientes':
      return isAdmin || isVendedor // Admin y vendedor
    case 'pedidos':
      return isAdmin || isVendedor // Admin y vendedor
    case 'pos':
      return isAdmin || isVendedor // Admin y vendedor
    default:
      return false
  }
}
```

## 🔒 **Seguridad Implementada**

### **Nivel de Ruta**
- Cada ruta está protegida con `RoleProtectedRoute`
- Verificación automática de permisos antes de renderizar
- Redirección automática si no tiene acceso

### **Nivel de Componente**
- El Layout oculta automáticamente menús no permitidos
- Verificación en tiempo real de permisos
- Indicadores visuales del rol del usuario

### **Nivel de API**
- Interceptores para manejar errores 401
- Validación de sesión en cada petición
- Fallback a datos mock en desarrollo

## 📱 **Interfaz de Usuario**

### **Indicadores Visuales**
- **Administrador**: Badge rojo con "Admin"
- **Vendedor**: Badge azul con "Vendedor"
- **Inventario**: Badge verde con "Inventario"

### **Navegación Dinámica**
- Solo se muestran los módulos permitidos
- Menú adaptativo según el rol
- Acceso directo a módulos autorizados

### **Responsive Design**
- Sidebar colapsable en móviles
- Navegación adaptativa
- Indicadores claros de permisos

## 🧪 **Escenarios de Prueba**

### **1. Login como Administrador**
- ✅ Acceso completo a todos los módulos
- ✅ Menú completo visible
- ✅ Badge rojo "Admin"
- ✅ Puede gestionar empleados

### **2. Login como Vendedor**
- ✅ Acceso a Dashboard, Clientes, Pedidos, POS
- ❌ Menú de Empleados oculto
- ❌ Menú de Productos oculto
- ✅ Badge azul "Vendedor"

### **3. Login como Inventario**
- ✅ Acceso solo a Dashboard y Productos
- ❌ Todos los demás módulos ocultos
- ✅ Badge verde "Inventario"
- ✅ Puede gestionar inventario

### **4. Intentos de Acceso No Autorizado**
- ❌ Redirección automática al dashboard
- ❌ Mensajes de error apropiados
- ❌ Logs de intentos de acceso

## 🔄 **Flujo de Trabajo por Rol**

### **Administrador**
1. Login → Dashboard completo
2. Acceso a todos los módulos
3. Gestión completa del sistema
4. Supervisión de todas las operaciones

### **Vendedor**
1. Login → Dashboard de ventas
2. Gestión de clientes
3. Procesamiento de pedidos
4. Uso del sistema POS

### **Inventario**
1. Login → Dashboard de inventario
2. Gestión de productos
3. Control de stock
4. Actualización de catálogo

## 🚨 **Manejo de Errores**

### **Errores de Autenticación**
- **401 Unauthorized**: Redirección al login
- **403 Forbidden**: Acceso denegado
- **404 Not Found**: Módulo no disponible

### **Fallbacks de Desarrollo**
- Datos mock si la API no está disponible
- Credenciales de prueba predefinidas
- Simulación de diferentes roles

## 🔧 **Configuración**

### **Variables de Entorno**
```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# Role Configuration
VITE_ROLE_ADMIN=1
VITE_ROLE_VENDEDOR=2
VITE_ROLE_INVENTARIO=3
```

### **Personalización de Roles**
Los permisos se pueden modificar en `src/contexts/AuthContext.tsx`:
```typescript
// Agregar nuevos módulos
case 'reportes':
  return isAdmin || isVendedor

// Modificar permisos existentes
case 'productos':
  return isAdmin || isInventario || isVendedor // Dar acceso a vendedores
```

## 📊 **Estadísticas de Uso**

### **Métricas por Rol**
- **Administrador**: Acceso completo, supervisión
- **Vendedor**: Enfoque en ventas y clientes
- **Inventario**: Enfoque en productos y stock

### **Auditoría**
- Logs de acceso por módulo
- Historial de operaciones por usuario
- Reportes de uso del sistema

## 🚀 **Próximas Mejoras**

- [ ] Roles personalizables por empresa
- [ ] Permisos granulares por acción
- [ ] Sistema de auditoría avanzado
- [ ] Roles temporales con expiración
- [ ] Integración con LDAP/Active Directory
- [ ] Multi-tenancy por empresa

---

**Sistema desarrollado con seguridad y escalabilidad en mente** 🔒✨

