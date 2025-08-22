# 🏢 Sistema de Gestión Empresarial - Backend + Panel Administrativo

Sistema completo de gestión empresarial con backend en Node.js/TypeScript y panel administrativo en Tauri + React.

## 🚀 **Características Principales**

### **Backend (Node.js + TypeScript)**
- API RESTful completa
- Base de datos MySQL/MariaDB
- Autenticación y autorización por roles
- CRUD completo para todas las entidades
- Validación de datos
- Middleware de seguridad

### **Panel Administrativo (Tauri + React)**
- Aplicación de escritorio multiplataforma
- Interfaz moderna con Tailwind CSS
- Sistema de roles y permisos
- Módulos: Dashboard, Empleados, Productos, Clientes, Pedidos, POS
- Funcionalidad offline cuando el backend no está disponible
- Formularios validados con react-hook-form

## 🏗️ **Arquitectura del Sistema**

```
backend_definitivo-2.0/
├── backend_definitivo/          # Backend en Node.js
│   ├── src/
│   │   ├── controllers/         # Controladores de la API
│   │   ├── models/             # Modelos de datos
│   │   ├── router/             # Rutas de la API
│   │   ├── middleware/         # Middleware personalizado
│   │   └── config/             # Configuración de BD
│   └── package.json
└── panel-administrativo/        # Frontend en Tauri + React
    ├── src/
    │   ├── components/          # Componentes reutilizables
    │   ├── pages/              # Páginas de la aplicación
    │   ├── contexts/           # Contextos de React
    │   ├── services/           # Servicios de API
    │   └── config/             # Configuración
    └── package.json
```

## 🎯 **Sistema de Roles**

### **Admin (Rol 1)**
- ✅ Acceso completo a todos los módulos
- ✅ Gestión de empleados
- ✅ Gestión de productos
- ✅ Gestión de clientes y pedidos
- ✅ Sistema POS

### **Vendedor (Rol 2)**
- ✅ Dashboard
- ✅ Sistema POS
- ✅ Gestión de pedidos
- ✅ Gestión de clientes
- ❌ Gestión de empleados
- ❌ Gestión de productos

### **Inventario (Rol 3)**
- ✅ Dashboard
- ✅ Gestión de productos
- ❌ Gestión de empleados
- ❌ Sistema POS
- ❌ Gestión de clientes y pedidos

## 🛠️ **Tecnologías Utilizadas**

### **Backend**
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MySQL/MariaDB
- **ORM**: Sequelize
- **Validation**: Joi/Yup

### **Frontend (Panel Administrativo)**
- **Framework**: Tauri (Rust + Web Technologies)
- **UI Library**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Forms**: react-hook-form + valibot
- **Routing**: React Router DOM
- **State Management**: React Context API
- **HTTP Client**: Axios

## 📋 **Módulos del Sistema**

### **1. Dashboard**
- Estadísticas en tiempo real
- Acciones rápidas por rol
- Actividad reciente
- Estado del sistema

### **2. Empleados**
- Crear, leer, actualizar, eliminar empleados
- Validación de datos (CUIL, email, teléfono)
- Gestión de roles y permisos
- Modo offline cuando el backend no está disponible

### **3. Productos**
- Catálogo completo de productos
- Gestión de variantes (talla, color)
- Control de inventario
- Categorización

### **4. Clientes**
- Base de datos de clientes
- Historial de compras
- Información de contacto
- Gestión de direcciones

### **5. Pedidos**
- Sistema de órdenes
- Estado de pedidos
- Historial de transacciones
- Facturación

### **6. Sistema POS**
- Interfaz de punto de venta
- Búsqueda rápida de productos
- Cálculo automático de totales
- Gestión de pagos

## 🚀 **Instalación y Configuración**

### **Prerrequisitos**
- Node.js 18+ 
- npm o yarn
- Rust (para Tauri)
- MySQL/MariaDB

### **Backend**
```bash
cd backend_definitivo
npm install
npm run dev
```

### **Panel Administrativo**
```bash
cd panel-administrativo
npm install
npm run tauri dev
```

## 🔧 **Configuración de Base de Datos**

1. Crear base de datos MySQL
2. Configurar variables de entorno en `backend_definitivo/src/config/db.ts`
3. Ejecutar migraciones si están disponibles

## 📱 **Funcionalidad Offline**

El panel administrativo incluye funcionalidad offline que permite:
- Crear y gestionar empleados sin conexión al backend
- Almacenamiento local de datos
- Sincronización automática cuando el backend esté disponible
- Exportación de datos offline

## 🧪 **Testing**

### **Credenciales de Prueba**
- **Admin**: `admin` / `admin`
- **Vendedor**: `vendedor` / `vendedor`
- **Inventario**: `inventario` / `inventario`

## 📁 **Estructura de Archivos Clave**

### **Backend**
- `src/controllers/`: Lógica de negocio
- `src/models/`: Modelos de datos
- `src/router/`: Definición de rutas API
- `src/middleware/`: Middleware personalizado

### **Frontend**
- `src/contexts/AuthContext.tsx`: Gestión de autenticación
- `src/services/api.ts`: Configuración de API
- `src/services/empleados.ts`: Servicios de empleados con fallback offline
- `src/components/Layout.tsx`: Layout principal con navegación
- `src/pages/`: Páginas de la aplicación

## 🔒 **Seguridad**

- Autenticación basada en sesiones
- Autorización por roles
- Validación de datos en frontend y backend
- Sanitización de inputs
- Middleware de seguridad

## 🚀 **Despliegue**

### **Backend**
- Configurar variables de entorno de producción
- Usar PM2 o similar para gestión de procesos
- Configurar reverse proxy (Nginx/Apache)

### **Panel Administrativo**
- Build de producción: `npm run tauri build`
- Distribuir ejecutables generados
- Actualizaciones automáticas (opcional)

## 🤝 **Contribución**

1. Fork del repositorio
2. Crear rama para feature (`git checkout -b feature/AmazingFeature`)
3. Commit de cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 **Soporte**

Para soporte técnico o preguntas:
- Crear un issue en GitHub
- Contactar al equipo de desarrollo

---

**Desarrollado con ❤️ usando las mejores tecnologías modernas**
