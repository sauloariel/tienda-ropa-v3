# Panel Administrativo

Un sistema completo de backoffice y POS (Point of Sale) construido con React, TypeScript y Tauri para aplicaciones de escritorio.

## 🚀 Características

### Backoffice
- **Dashboard**: Resumen general con estadísticas del negocio
- **Gestión de Productos**: CRUD completo de inventario
- **Gestión de Clientes**: Base de datos de clientes
- **Gestión de Pedidos**: Seguimiento de órdenes
- **Gestión de Empleados**: Administración del personal **🔒 Solo Administradores**
- **Sistema de Autenticación**: Login seguro con contexto de React y control de roles

### POS (Point of Sale)
- **Catálogo de Productos**: Búsqueda y selección rápida
- **Carrito de Compras**: Gestión de items y cantidades
- **Métodos de Pago**: Múltiples opciones de pago
- **Interfaz Intuitiva**: Diseñada para uso en punto de venta

## 🔐 Control de Acceso por Roles

### Usuario Administrador (Rol = 1)
- ✅ Acceso completo a todos los módulos
- ✅ Gestión completa de empleados
- ✅ Acceso al dashboard administrativo
- ✅ Indicador visual de rol "Admin"

### Usuario Normal (Rol ≠ 1)
- ✅ Acceso a productos, clientes, pedidos y POS
- ❌ **NO puede acceder al módulo de empleados**
- ❌ **NO puede ver el menú de empleados**
- ❌ **NO puede acceder a rutas protegidas**

### Seguridad Implementada
- **Verificación automática de roles** en cada ruta
- **Redirección automática** si no tiene permisos
- **Ocultación de menús** según el rol del usuario
- **Protección a nivel de componente** y ruta

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Tailwind CSS
- **Iconos**: Lucide React
- **Desktop**: Tauri (Rust + Web Technologies)
- **Routing**: React Router DOM
- **Estado**: React Context API
- **HTTP Client**: Axios con interceptores
- **Autenticación**: JWT + Roles basados en base de datos

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- Rust (para Tauri)
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   cd panel-administrativo
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Instalar dependencias de Rust (Tauri)**
   ```bash
   # En Windows, asegúrate de tener Rust instalado
   # https://rustup.rs/
   ```

## 🚀 Desarrollo

### Modo Desarrollo
```bash
# Iniciar en modo desarrollo (solo frontend)
npm run dev

# Iniciar aplicación Tauri completa
npm run tauri dev
```

### Construcción
```bash
# Construir para producción
npm run build

# Construir aplicación Tauri
npm run tauri build
```

## 🏗️ Estructura del Proyecto

```
panel-administrativo/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   └── Layout.tsx      # Layout principal con sidebar y control de roles
│   ├── contexts/            # Contextos de React
│   │   └── AuthContext.tsx # Contexto de autenticación con verificación de roles
│   ├── pages/               # Páginas de la aplicación
│   │   ├── Dashboard.tsx   # Dashboard principal
│   │   ├── Productos.tsx   # Gestión de productos
│   │   ├── Clientes.tsx    # Gestión de clientes
│   │   ├── Pedidos.tsx     # Gestión de pedidos
│   │   ├── Empleados.tsx   # Gestión de empleados (Solo Admin)
│   │   ├── POS.tsx         # Punto de venta
│   │   └── Login.tsx       # Página de login
│   ├── services/            # Servicios de API
│   │   └── api.ts          # Cliente HTTP con interceptores
│   ├── config/              # Configuración de la aplicación
│   │   └── config.ts       # Variables de configuración
│   ├── App.tsx             # Componente principal con rutas protegidas
│   ├── main.tsx            # Punto de entrada
│   └── index.css           # Estilos globales
├── src-tauri/               # Backend de Tauri (Rust)
├── public/                  # Archivos estáticos
├── package.json             # Dependencias de Node.js
├── tauri.conf.json         # Configuración de Tauri
├── tailwind.config.js      # Configuración de Tailwind
└── EMPLEADOS_README.md     # Documentación específica del módulo de empleados
```

## 🔐 Autenticación y Roles

### Sistema de Login
El sistema intenta conectarse primero con el backend real:
- **Backend Disponible**: Usa autenticación real con roles de la base de datos
- **Backend No Disponible**: Fallback a credenciales de desarrollo

### Credenciales de Desarrollo
- **Usuario**: `admin`
- **Contraseña**: `admin`
- **Rol**: 1 (Administrador)

### Estructura de Roles
```typescript
interface User {
  id: number
  username: string
  role: number        // 1 = Admin, otros = Usuario normal
  name: string
  empleado?: {
    nombre: string
    apellido: string
  }
}
```

## 🎨 Personalización

### Colores
Los colores principales se pueden personalizar en `tailwind.config.js`:
```javascript
colors: {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  }
}
```

### Componentes
Los componentes utilizan clases CSS personalizadas definidas en `src/index.css`:
- `.btn-primary`: Botón principal
- `.btn-secondary`: Botón secundario
- `.card`: Contenedor de tarjeta
- `.input-field`: Campo de entrada

## 🔌 Integración con Backend

### Configuración de API
```typescript
// src/config/config.ts
export const config = {
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 10000,
  }
}
```

### Endpoints Principales
- **Autenticación**: `POST /api/loguin/login`
- **Empleados**: `GET/POST/PUT/DELETE /api/empleados`
- **Productos**: `GET/POST/PUT/DELETE /api/productos`
- **Clientes**: `GET/POST/PUT/DELETE /api/clientes`
- **Pedidos**: `GET/POST/PUT/DELETE /api/pedidos`

### Manejo de Errores
- **401 Unauthorized**: Redirección automática al login
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Error del servidor
- **Fallback**: Datos mock para desarrollo

## 📱 Características de Tauri

- **Aplicación de Escritorio**: Funciona offline
- **Acceso al Sistema**: Permisos controlados
- **Multiplataforma**: Windows, macOS, Linux
- **Tamaño Optimizado**: Binario pequeño y eficiente

## 🚀 Despliegue

### Construir para Producción
```bash
npm run tauri build
```

Los archivos se generarán en `src-tauri/target/release/`

### Distribución
- **Windows**: `.msi` installer
- **macOS**: `.dmg` package
- **Linux**: `.AppImage` o `.deb`

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación de [Tauri](https://tauri.app/)
2. Consulta la documentación de [React](https://reactjs.org/)
3. Revisa `EMPLEADOS_README.md` para el módulo de empleados
4. Abre un issue en el repositorio

## 🔮 Roadmap

- [x] Sistema de autenticación con roles
- [x] Control de acceso basado en roles
- [x] Módulo de empleados completo (Solo Admin)
- [x] Integración con backend real
- [ ] Integración completa con backend
- [ ] Sistema de reportes avanzado
- [ ] Múltiples monedas
- [ ] Integración con impresoras térmicas
- [ ] Modo offline completo
- [ ] Sincronización en la nube
- [ ] Múltiples idiomas
- [ ] Temas personalizables

---

**Desarrollado con ❤️ usando React, TypeScript y Tauri**

### 🔒 Seguridad Implementada
- Control de acceso basado en roles
- Verificación automática de permisos
- Redirección automática para usuarios no autorizados
- Interceptores de seguridad en la API
- Protección de rutas a nivel de aplicación
