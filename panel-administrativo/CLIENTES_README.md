# Módulo de Gestión de Clientes

## 📋 Descripción

El módulo de gestión de clientes proporciona una interfaz completa para administrar la base de datos de clientes del sistema. Permite crear, visualizar, editar y eliminar clientes, con funcionalidades de búsqueda, filtrado y **gestión segura de contraseñas**.

## 🚀 Funcionalidades Principales

### **Gestión Completa de Clientes**
- **Crear Cliente**: Modal completo para agregar nuevos clientes con contraseña opcional
- **Visualizar Clientes**: Lista completa con información detallada (sin contraseñas)
- **Editar Cliente**: Modal completo para modificar todos los campos incluyendo contraseña
- **Eliminar Cliente**: Confirmación antes de eliminar
- **Estado del Cliente**: Visualización clara (Activo/Inactivo)

### **Seguridad de Contraseñas** 🔐
- **Hashing Automático**: Las contraseñas se hashean con bcrypt (salt rounds: 10)
- **Campo Opcional**: La contraseña es opcional al crear clientes
- **Actualización Segura**: Solo se actualiza la contraseña si se proporciona una nueva
- **Ocultación**: Las contraseñas nunca se muestran en el frontend
- **Validación**: Mínimo 6 caracteres para contraseñas

### **Campos del Cliente**
- **Identificación**: DNI, CUIT/CUIL
- **Datos Personales**: Nombre, Apellido
- **Contacto**: Email, Teléfono
- **Ubicación**: Domicilio
- **Estado**: Activo/Inactivo
- **Seguridad**: Contraseña (opcional, hasheada)

### **Funcionalidades Avanzadas**
- Estadísticas en tiempo real (total, activos, inactivos)
- Búsqueda por nombre, apellido, email o DNI
- Tabla responsive con ordenamiento visual
- Validación de formularios en tiempo real
- Manejo seguro de credenciales

## 🔧 Tecnologías Utilizadas

### **Frontend**
- React 18+ con TypeScript
- Tailwind CSS para estilos
- Lucide React para iconos
- Estado local con React Hooks

### **Backend**
- Node.js con Express
- TypeScript
- Sequelize ORM
- SQLite como base de datos
- **bcrypt** para hashing de contraseñas
- Validación con express-validator

## 📁 Estructura de Archivos

```
panel-administrativo/
├── src/
│   ├── pages/
│   │   └── Clientes.tsx          # Página principal del módulo
│   └── services/
│       └── clientes.ts           # API service para clientes
```

```
backend_definitivo/
├── src/
├── controllers/
│   └── ClienteController.ts      # Lógica de negocio con hashing
├── models/
│   └── Clientes.model.ts         # Modelo de datos
└── router/
    └── RouterCliente.ts          # Rutas de la API con validación
```

## 🌐 Endpoints de la API

### **POST /api/clientes**
- Crea un nuevo cliente
- Body: Objeto ClienteCreate (incluye password opcional)
- **Seguridad**: La contraseña se hashea antes de guardar
- Respuesta: Cliente creado (201)

### **GET /api/clientes**
- Obtiene todos los clientes
- **Seguridad**: Las contraseñas se excluyen de la respuesta
- Respuesta: Array de objetos Cliente (sin passwords)

### **GET /api/clientes/:id**
- Obtiene un cliente específico por ID
- Parámetros: `id` (número)
- **Seguridad**: La contraseña se excluye de la respuesta
- Respuesta: Objeto Cliente (sin password)

### **PUT /api/clientes/:id**
- Actualiza un cliente existente
- Parámetros: `id` (número)
- Body: Objeto ClienteUpdate (password opcional)
- **Seguridad**: Solo se actualiza la contraseña si se proporciona una nueva
- Respuesta: Cliente actualizado (sin password)

### **DELETE /api/clientes/:id**
- Elimina un cliente
- Parámetros: `id` (número)
- Respuesta: 204 No Content

## 📊 Estructura de Datos

### **Cliente (Modelo)**
```typescript
interface Cliente {
  id_cliente: number
  dni: string
  cuit_cuil: string
  nombre: string
  apellido: string
  domicilio: string
  telefono: string
  mail: string
  estado?: string
  password?: string  // Hasheada en la base de datos
}
```

### **ClienteCreate (Para creación)**
```typescript
interface ClienteCreate {
  dni: string
  cuit_cuil: string
  nombre: string
  apellido: string
  domicilio: string
  telefono: string
  mail: string
  estado?: string
  password?: string  // Opcional, se hashea si se proporciona
}
```

### **ClienteUpdate (Para edición)**
```typescript
interface ClienteUpdate {
  dni?: string
  cuit_cuil?: string
  nombre?: string
  apellido?: string
  domicilio?: string
  telefono?: string
  mail?: string
  estado?: string
  password?: string  // Solo se actualiza si se proporciona
}
```

## 🔐 Seguridad de Contraseñas

### **Hashing con bcrypt**
- **Algoritmo**: bcrypt con salt rounds = 10
- **Seguridad**: Protección contra ataques de fuerza bruta
- **Implementación**: Automática en el backend

### **Flujo de Seguridad**
1. **Creación**: Si se proporciona contraseña → se hashea → se guarda
2. **Lectura**: Las contraseñas nunca se envían al frontend
3. **Actualización**: Solo se actualiza si se proporciona una nueva
4. **Verificación**: Función auxiliar para login futuro

### **Función de Verificación**
```typescript
export const verifyPassword = async (clienteId: number, password: string): Promise<boolean>
```
- Compara contraseña en texto plano con hash almacenado
- Útil para implementar sistema de login de clientes

## 🎯 Características del Frontend

### **Interfaz de Usuario**
- **Header**: Título, descripción y botón "Nuevo Cliente"
- **Estadísticas**: Cards con métricas clave
- **Búsqueda**: Campo de búsqueda con filtrado en tiempo real
- **Tabla**: Vista tabular con todas las columnas relevantes
- **Acciones**: Botones de editar y eliminar por fila

### **Modal de Creación**
- Formulario completo con validación HTML5
- **Campo de Contraseña**: Opcional con validación de longitud
- Campos requeridos marcados con asterisco (*)
- Placeholders informativos para cada campo
- Selector de estado por defecto (Activo)
- Botones de crear y cancelar

### **Modal de Edición**
- Formulario completo con validación
- Campos pre-poblados con datos actuales
- **Campo de Nueva Contraseña**: Solo se actualiza si se completa
- Selector de estado (Activo/Inactivo)
- Botones de guardar y cancelar

### **Estados de la Aplicación**
- **Loading**: Spinner durante carga de datos
- **Error**: Alertas rojas para errores
- **Success**: Alertas verdes para operaciones exitosas
- **Empty**: Manejo de listas vacías

## 🔍 Funcionalidades de Búsqueda

### **Filtrado en Tiempo Real**
- Búsqueda por nombre completo
- Búsqueda por email
- Búsqueda por DNI
- Filtrado instantáneo sin recargar

### **Lógica de Filtrado**
```typescript
const filteredClientes = clientes.filter(cliente =>
  cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
  cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
  cliente.mail.toLowerCase().includes(searchTerm.toLowerCase()) ||
  cliente.dni.includes(searchTerm)
)
```

## 🎨 Estilos y Diseño

### **Componentes de UI**
- **Cards**: Contenedores con sombras y bordes redondeados
- **Botones**: Estilos consistentes (primary, secondary)
- **Tabla**: Diseño limpio con hover effects
- **Modal**: Overlay con backdrop y animaciones

### **Colores y Estados**
- **Activo**: Verde (bg-green-100, text-green-800)
- **Inactivo**: Rojo (bg-red-100, text-red-800)
- **Sin Estado**: Gris (bg-gray-100, text-gray-800)
- **Acciones**: Azul para editar, rojo para eliminar

### **Formularios**
- **Campos Requeridos**: Marcados con asterisco (*)
- **Validación**: HTML5 nativo con mensajes personalizados
- **Placeholders**: Textos informativos para guiar al usuario
- **Espaciado**: Layout consistente con `space-y-4`

## ✅ Funcionalidades Implementadas

### **CRUD Completo con Seguridad**
- ✅ **Crear**: Modal de creación con contraseña opcional y hashing
- ✅ **Leer**: Lista completa con búsqueda y filtrado (sin passwords)
- ✅ **Actualizar**: Modal de edición con contraseña opcional
- ✅ **Eliminar**: Confirmación antes de eliminar

### **Seguridad de Contraseñas**
- ✅ **Hashing**: bcrypt con salt rounds = 10
- ✅ **Ocultación**: Las contraseñas nunca se muestran
- ✅ **Validación**: Mínimo 6 caracteres
- ✅ **Actualización**: Solo si se proporciona nueva contraseña

### **Características Avanzadas**
- ✅ Estadísticas en tiempo real
- ✅ Búsqueda multi-campo
- ✅ Validación de formularios
- ✅ Manejo de errores y éxito
- ✅ Estados de carga
- ✅ Diseño responsive

## 🔮 Mejoras Futuras Sugeridas

### **Funcionalidades Adicionales**
- ✅ Implementar paginación para mejor rendimiento
- ✅ Agregar ordenamiento por columnas
- ✅ Implementar filtros avanzados por estado
- ✅ Agregar exportación a CSV/Excel
- ✅ Implementar historial de cambios

### **Seguridad Avanzada**
- ✅ **Sistema de Login**: Utilizar `verifyPassword` para autenticación
- ✅ **Tokens JWT**: Para sesiones de clientes
- ✅ **Recuperación de Contraseña**: Sistema de reset por email
- ✅ **Auditoría**: Logs de cambios de contraseña

### **Mejoras de UX**
- ✅ Confirmación antes de editar
- ✅ Validación en tiempo real en formularios
- ✅ Autocompletado en campos de búsqueda
- ✅ Notificaciones push para operaciones

## 📱 Responsive Design

### **Breakpoints**
- **Mobile**: < 640px - Tabla con scroll horizontal
- **Tablet**: 640px - 1024px - Layout adaptativo
- **Desktop**: > 1024px - Vista completa optimizada

### **Adaptaciones Móviles**
- Tabla con scroll horizontal en dispositivos pequeños
- Botones de acción apilados verticalmente
- Modal centrado y responsive
- Campos de formulario optimizados para touch

## 🧪 Testing

### **Funcionalidades a Probar**
- ✅ Carga inicial de clientes
- ✅ Creación de nuevos clientes con contraseña
- ✅ Creación de clientes sin contraseña
- ✅ Búsqueda y filtrado
- ✅ Edición de clientes
- ✅ Cambio de contraseñas
- ✅ Eliminación de clientes
- ✅ Manejo de errores
- ✅ Estados de loading

### **Casos de Uso de Seguridad**
- ✅ Cliente con contraseña válida (6+ caracteres)
- ✅ Cliente con contraseña inválida (< 6 caracteres)
- ✅ Cliente sin contraseña
- ✅ Actualización de contraseña existente
- ✅ Mantenimiento de contraseña al editar otros campos

## 📚 Documentación de la API

### **Validaciones del Backend**
- DNI: mínimo 7 caracteres
- CUIT/CUIL: requerido
- Nombre y Apellido: requeridos
- Domicilio: requerido
- Teléfono: requerido
- Email: formato válido
- **Contraseña**: mínimo 6 caracteres (opcional)

### **Códigos de Respuesta**
- **200**: Operación exitosa
- **201**: Cliente creado
- **204**: Cliente eliminado
- **400**: Datos inválidos
- **404**: Cliente no encontrado
- **500**: Error interno del servidor

### **Seguridad de Respuestas**
- **GET endpoints**: Nunca incluyen contraseñas
- **POST/PUT**: Retornan cliente sin contraseña
- **DELETE**: Solo código de estado

## 🚀 Instalación y Configuración

### **Requisitos Previos**
- Node.js 16+
- npm o yarn
- Backend funcionando en puerto 4000

### **Dependencias del Backend**
```bash
npm install bcrypt @types/bcrypt
```

### **Pasos de Instalación**
1. Clonar el repositorio
2. Instalar dependencias: `npm install`
3. Configurar variables de entorno
4. Iniciar el backend: `npm run dev`
5. Iniciar el frontend: `npm run dev`

### **Configuración del Backend**
1. Verificar conexión a base de datos
2. Ejecutar migraciones si es necesario
3. Verificar que las rutas estén registradas
4. Probar endpoints con Postman o similar

## 🔐 Consideraciones de Seguridad

### **Buenas Prácticas Implementadas**
- ✅ **Hashing**: Contraseñas hasheadas con bcrypt
- ✅ **Ocultación**: Las contraseñas nunca se envían al frontend
- ✅ **Validación**: Longitud mínima de contraseñas
- ✅ **Actualización Segura**: Solo se cambia si se proporciona nueva

### **Recomendaciones Adicionales**
- 🔒 **HTTPS**: Usar en producción
- 🔒 **Rate Limiting**: Para endpoints de autenticación
- 🔒 **Logs de Seguridad**: Registrar intentos de login
- 🔒 **Política de Contraseñas**: Requisitos de complejidad

## 📞 Soporte y Contacto

Para reportar bugs o solicitar nuevas funcionalidades:
- Crear un issue en el repositorio
- Incluir pasos para reproducir el problema
- Adjuntar logs de error si es aplicable
- Especificar versión del navegador y sistema operativo

---

**Última actualización**: Enero 2025
**Versión**: 1.2.0
**Estado**: ✅ CRUD Completo con Gestión Segura de Contraseñas
**Nuevas Funcionalidades**: ✅ Crear Cliente, ✅ Validación de Formularios, ✅ **Hashing de Contraseñas**, ✅ **Seguridad Avanzada**
