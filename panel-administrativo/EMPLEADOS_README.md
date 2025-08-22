# Módulo de Empleados - Panel Administrativo

## 🔐 Control de Acceso

El módulo de empleados está restringido **SOLO para usuarios con rol de administrador (rol = 1)**.

### Requisitos de Acceso:
- Usuario debe estar autenticado
- Usuario debe tener `id_rol = 1` en la base de datos
- El sistema verifica automáticamente los permisos

## 🏗️ Estructura del Backend

### Modelo de Empleados (`Empleados.model.ts`)
```typescript
interface Empleado {
  id_empleado: number        // PK, Auto-increment
  cuil: string              // Unique, 11 caracteres
  nombre: string            // 25 caracteres
  apellido: string          // 30 caracteres
  domicilio: string         // 35 caracteres
  telefono: string          // 13 caracteres
  mail: string              // 45 caracteres
  sueldo?: number           // Decimal(60,2)
  puesto?: string           // 20 caracteres
  estado?: string           // 8 caracteres
}
```

### Modelo de Login (`Loguin.model.ts`)
```typescript
interface Login {
  id_loguin: number         // PK, Auto-increment
  id_empleado: number       // FK a Empleados
  id_rol: number            // FK a Roles
  usuario: string           // Unique, 20 caracteres
  passwd?: string           // 500 caracteres
  password_provisoria?: boolean
  fecha_cambio_pass?: Date
}
```

### Modelo de Roles (`Roles.model.ts`)
```typescript
interface Rol {
  id_rol: number            // PK, Auto-increment
  descripcion?: string      // 15 caracteres
}
```

## 🔌 Endpoints de la API

### Empleados
- `GET /api/empleados` - Obtener todos los empleados
- `GET /api/empleados/:id` - Obtener empleado por ID
- `POST /api/empleados` - Crear nuevo empleado
- `PUT /api/empleados/:id` - Actualizar empleado
- `DELETE /api/empleados/:id` - Eliminar empleado

### Autenticación
- `POST /api/loguin/login` - Login de usuario

## 🚀 Funcionalidades Implementadas

### ✅ CRUD Completo
- **Crear**: Formulario completo con validaciones
- **Leer**: Tabla con búsqueda y filtros
- **Actualizar**: Edición inline con modal
- **Eliminar**: Confirmación antes de eliminar

### ✅ Validaciones
- Campos requeridos marcados
- Límites de caracteres según el modelo
- Validación de email
- Validación de CUIL (11 dígitos)

### ✅ Interfaz de Usuario
- Tabla responsive con ordenamiento
- Búsqueda en tiempo real
- Estadísticas en tiempo real
- Modal de formulario responsive
- Indicadores de estado visuales

### ✅ Seguridad
- Verificación de rol de administrador
- Redirección automática si no tiene permisos
- Interceptor de errores 401 (no autorizado)
- Fallback a datos mock en desarrollo

## 🎯 Campos del Formulario

| Campo | Tipo | Requerido | Máximo | Descripción |
|-------|------|-----------|---------|-------------|
| CUIL | Text | Sí | 11 | Número de identificación único |
| Nombre | Text | Sí | 25 | Nombre del empleado |
| Apellido | Text | Sí | 30 | Apellido del empleado |
| Domicilio | Text | Sí | 35 | Dirección del empleado |
| Teléfono | Text | Sí | 13 | Número de teléfono |
| Email | Email | Sí | 45 | Correo electrónico |
| Sueldo | Number | No | - | Salario del empleado |
| Puesto | Text | No | 20 | Cargo o posición |
| Estado | Select | No | 8 | Estado del empleado |

### Estados Disponibles:
- **Activo**: Empleado trabajando normalmente
- **Inactivo**: Empleado no activo
- **Vacaciones**: Empleado en período de vacaciones
- **Licencia**: Empleado con licencia médica

## 🔧 Configuración

### Variables de Entorno
```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# Features
VITE_FEATURE_EMPLOYEES_ENABLED=true
VITE_FEATURE_EMPLOYEES_REQUIRE_ADMIN=true
```

### Configuración de la Aplicación
```typescript
// src/config/config.ts
export const config = {
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 10000,
  },
  features: {
    employees: {
      enabled: true,
      requireAdmin: true,
    }
  }
}
```

## 🚨 Manejo de Errores

### Errores de API
- **401 Unauthorized**: Redirección automática al login
- **404 Not Found**: Empleado no encontrado
- **500 Internal Server Error**: Error del servidor

### Fallback de Desarrollo
Si la API no está disponible, el sistema usa datos mock para desarrollo:
```typescript
// Datos de ejemplo
const mockEmployees = [
  {
    id_empleado: 1,
    cuil: '20123456789',
    nombre: 'Ana',
    apellido: 'García',
    domicilio: 'Calle 123',
    telefono: '+1234567890',
    mail: 'ana@empresa.com',
    sueldo: 4500,
    puesto: 'Gerente',
    estado: 'Activo'
  }
]
```

## 📱 Responsive Design

- **Desktop**: Tabla completa con todas las columnas
- **Tablet**: Tabla con scroll horizontal
- **Mobile**: Vista de tarjetas para mejor usabilidad

## 🔄 Flujo de Trabajo

1. **Login**: Usuario se autentica con credenciales
2. **Verificación de Rol**: Sistema verifica si es admin (rol = 1)
3. **Acceso al Módulo**: Si es admin, puede ver el menú de empleados
4. **CRUD Operations**: Puede crear, leer, actualizar y eliminar empleados
5. **Validaciones**: Sistema valida datos antes de enviar a la API
6. **Feedback**: Usuario recibe confirmación de operaciones

## 🧪 Testing

### Credenciales de Prueba
- **Usuario**: `admin`
- **Contraseña**: `admin`
- **Rol**: 1 (Administrador)

### Escenarios de Prueba
- ✅ Login como admin → Acceso completo
- ✅ Login como usuario normal → Sin acceso a empleados
- ✅ Crear empleado → Validaciones funcionando
- ✅ Editar empleado → Formulario pre-llenado
- ✅ Eliminar empleado → Confirmación requerida
- ✅ Búsqueda → Filtrado en tiempo real

## 🚀 Próximas Mejoras

- [ ] Exportación a Excel/PDF
- [ ] Importación masiva de empleados
- [ ] Historial de cambios
- [ ] Fotos de empleados
- [ ] Gestión de horarios
- [ ] Reportes avanzados
- [ ] Integración con sistema de nóminas

