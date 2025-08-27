# 🛍️ Tienda de Ropa - Sistema Completo con POS

Sistema completo de gestión para tienda de ropa con **panel administrativo**, **API backend**, **frontend de ventas** y **sistema POS profesional** con facturación.

## 🚀 Características Principales

### 🏪 **Sistema POS (Point of Sale) - NUEVO!**
- **Interfaz de supermercado** moderna y responsiva
- **Grid de productos** con filtros por categoría y búsqueda
- **Carrito de compras** en tiempo real con cálculos automáticos
- **Procesamiento de pagos**: Efectivo, Tarjeta, Transferencia, QR
- **Gestión automática de stock** durante las ventas
- **Generación de tickets** de venta
- **Historial de transacciones** completo

### 📊 Panel Administrativo
- **Dashboard** con estadísticas en tiempo real
- **Gestión de Productos** con variantes (colores, tallas, imágenes)
- **Gestión de Clientes** con sistema de contraseñas hasheadas
- **Gestión de Empleados** y roles de usuario
- **Sistema de Ventas** completo con estadísticas
- **Módulo de Marketing** para promociones y descuentos
- **Estadísticas empresariales** para toma de decisiones

### 🔧 Backend API
- **Node.js + Express + TypeScript**
- **Base de datos SQLite** con Sequelize ORM
- **Autenticación JWT** con roles y permisos
- **Validaciones** con express-validator
- **Hashing de contraseñas** con bcrypt
- **API RESTful** para gestión de ventas

### 🎨 Frontend
- **React + TypeScript**
- **Tailwind CSS** para diseño responsivo
- **Hooks personalizados** para lógica reutilizable
- **Componentes modulares** y bien organizados
- **Integración completa** con backend
- **Sistema de navegación** entre tienda web y POS

## 🏗️ Estructura del Proyecto

```
├── backend_definitivo/          # API Backend
│   ├── src/
│   │   ├── controllers/        # Controladores de API
│   │   │   ├── VentasController.ts    # 🆕 Controlador de ventas
│   │   │   └── ...                    # Otros controladores
│   │   ├── models/            # Modelos de base de datos
│   │   │   ├── Ventas.model.ts        # 🆕 Modelo de ventas
│   │   │   ├── DetalleVentas.model.ts # 🆕 Detalles de venta
│   │   │   └── ...                    # Otros modelos
│   │   ├── router/            # Rutas de API
│   │   │   ├── RouterVentas.ts        # 🆕 Rutas de ventas
│   │   │   └── ...                    # Otras rutas
│   │   └── middleware/        # Middleware de autenticación
│   └── dist/                  # Código compilado
├── panel-administrativo/       # Panel de administración
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   ├── pages/            # Páginas principales
│   │   │   ├── Ventas.tsx            # 🆕 Página de ventas
│   │   │   └── ...                    # Otras páginas
│   │   ├── hooks/            # Hooks personalizados
│   │   ├── services/         # Servicios de API
│   │   └── types/            # Tipos TypeScript
│   └── dist/                  # Build de producción
└── tienda-ropa/               # Frontend de tienda + POS
    ├── src/
    │   ├── components/        # Componentes del POS
    │   │   ├── POSSystem.tsx          # 🆕 Sistema POS principal
    │   │   ├── ProductGrid.tsx        # 🆕 Grid de productos
    │   │   ├── Cart.tsx               # 🆕 Carrito de compras
    │   │   ├── PaymentModal.tsx       # 🆕 Modal de pagos
    │   │   └── AppNavigation.tsx      # 🆕 Navegación
    │   ├── services/         # Servicios
    │   │   └── posService.ts          # 🆕 Servicios del POS
    │   └── ...               # Otros archivos
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **TypeScript** - Superset de JavaScript
- **Sequelize** - ORM para base de datos
- **sequelize-typescript** - Decoradores para modelos
- **SQLite** - Base de datos local
- **JWT** - Autenticación
- **bcrypt** - Hashing de contraseñas

### Frontend
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS
- **Vite** - Build tool
- **Axios** - Cliente HTTP
- **React Router** - Enrutamiento
- **Lucide React** - Iconos

## 📋 Módulos Implementados

### 1. **Dashboard**
- Estadísticas de ventas, productos y clientes
- Gráficos y métricas en tiempo real
- Resumen ejecutivo para toma de decisiones

### 2. **Productos**
- CRUD completo de productos
- Gestión de variantes (colores, tallas)
- Subida y gestión de imágenes
- Control de inventario

### 3. **Clientes**
- Gestión completa de clientes
- Sistema de contraseñas seguras
- Historial de compras
- Información de contacto

### 4. **Ventas (POS) - 🆕 NUEVO!**
- **Sistema de punto de venta** profesional
- **Selección de productos** con grid visual
- **Carrito de compras** en tiempo real
- **Validación de stock** automática
- **Procesamiento de pagos** múltiples
- **Generación de tickets** de venta
- **Historial de transacciones** completo
- **Estadísticas de ventas** detalladas
- **Anulación de ventas** con restauración de stock

### 5. **Marketing**
- Gestión de promociones
- Tipos de descuento (porcentaje, monto fijo, 2x1)
- Códigos de descuento
- Fechas de vigencia
- Estadísticas de uso

### 6. **Empleados**
- Gestión de usuarios del sistema
- Roles y permisos
- Control de acceso por módulos

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone https://github.com/sauloariel/Tienda_ropa.git
cd Tienda_ropa
```

### 2. Configurar Backend
```bash
cd backend_definitivo
npm install
npm run build
npm start
```

### 3. Configurar Panel Administrativo
```bash
cd panel-administrativo
npm install
npm run dev
```

### 4. Configurar Tienda + POS
```bash
cd tienda-ropa
npm install
npm run dev
```

### 5. 🆕 Inicio rápido del sistema completo
```bash
# Windows
start-pos-system.bat

# Linux/Mac
./start-tienda-completa.sh
```

## 🔐 Configuración de Base de Datos

El sistema utiliza SQLite por defecto. La base de datos se crea automáticamente al iniciar el backend.

### Variables de Entorno
```
PORT=4000
JWT_SECRET=tu_secreto_jwt
DB_PATH=./database.sqlite
```

## 📱 Características del Sistema

### 🔒 Seguridad
- Autenticación JWT
- Hashing de contraseñas con bcrypt
- Control de acceso por roles
- Validación de datos en frontend y backend

### 📊 Rendimiento
- Lazy loading de componentes
- Optimización de consultas de base de datos
- Caché de datos frecuentes
- Compresión de imágenes

### 🎯 UX/UI
- Diseño responsivo para todos los dispositivos
- Interfaz intuitiva y moderna
- Feedback visual inmediato
- Navegación clara y consistente
- **Sistema POS optimizado para uso profesional**

## 🧪 Testing

### Backend
```bash
cd backend_definitivo
npm test
```

### Frontend
```bash
cd panel-administrativo
npm test
```

## 📈 Roadmap

### Versión 1.1 ✅ COMPLETADO
- ✅ Sistema POS completo
- ✅ Gestión de ventas
- ✅ Facturación y tickets
- ✅ Control de stock automático

### Versión 1.2
- Sistema de notificaciones
- Reportes avanzados
- Integración con pasarelas de pago

### Versión 2.0
- App móvil nativa
- Sistema de fidelización
- Analytics avanzado

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Saulo Ariel**

* GitHub: [@sauloariel](https://github.com/sauloariel)

## 🙏 Agradecimientos

* Comunidad de React y Node.js
* Tailwind CSS por el framework de diseño
* Lucide por los iconos hermosos
* Sequelize por el ORM robusto

---

⭐ **Si te gusta este proyecto, dale una estrella en GitHub!**

## 🔗 Enlaces del Proyecto

- **Repositorio**: https://github.com/sauloariel/Tienda_ropa
- **Demo en vivo**: Disponible en el repositorio
- **Documentación**: Incluida en cada módulo

---

**🎉 ¡El sistema POS está completamente funcional y listo para producción!**
