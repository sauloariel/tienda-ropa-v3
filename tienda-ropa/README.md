# Tienda de Ropa - Frontend

Una aplicación web moderna para una tienda de ropa que se conecta con el backend para mostrar productos reales de la base de datos.

## 🚀 Características

- **Conexión con Backend**: Se conecta a la API del backend para obtener productos y categorías reales
- **Filtrado por Categorías**: Filtra productos por categorías de la base de datos
- **Búsqueda en Tiempo Real**: Busca productos por descripción
- **Diseño Responsivo**: Interfaz moderna y adaptable a todos los dispositivos
- **Gestión de Estado**: Manejo eficiente del estado de la aplicación
- **Tipos TypeScript**: Tipado completo para mejor desarrollo

## 🛠️ Tecnologías

- **React 19** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS** - Framework de CSS utilitario
- **Axios** - Cliente HTTP para llamadas a la API
- **Lucide React** - Iconos modernos y ligeros
- **Vite** - Herramienta de construcción rápida

## 📋 Prerrequisitos

- Node.js 18+ instalado
- Backend funcionando en `http://localhost:4000`
- Base de datos configurada y sincronizada

## 🔧 Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone <url-del-repositorio>
   cd tienda-ropa
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Verificar configuración del backend**:
   - Asegúrate de que el backend esté corriendo en `http://localhost:4000`
   - Verifica que las rutas `/api/productos` y `/api/categorias` estén disponibles

## 🚀 Uso

### Desarrollo
```bash
npm run dev
```
La aplicación se abrirá en `http://localhost:5173`

### Construcción
```bash
npm run build
```

### Vista previa de producción
```bash
npm run preview
```

## 🔌 Configuración de la API

La aplicación se conecta al backend a través de las siguientes rutas:

- **Productos**: `GET /api/productos`
- **Categorías**: `GET /api/categorias`
- **Producto por ID**: `GET /api/productos/:id`
- **Productos por categoría**: `GET /api/productos?categoria=:id`

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ProductCard.tsx     # Tarjeta de producto
│   ├── CategoryFilter.tsx  # Filtro de categorías
│   ├── SearchBar.tsx       # Barra de búsqueda
│   ├── Header.tsx          # Encabezado de la página
│   └── Footer.tsx          # Pie de página
├── services/            # Servicios de API
│   └── api.ts              # Cliente HTTP y endpoints
├── types/               # Definiciones de tipos TypeScript
│   └── productos.types.ts  # Tipos de productos y categorías
├── App.tsx              # Componente principal
└── main.tsx             # Punto de entrada
```

## 🎨 Personalización

### Colores y Estilos
Los estilos se pueden personalizar editando `tailwind.config.js` y `src/index.css`.

### Componentes
Cada componente está diseñado para ser reutilizable y fácilmente personalizable.

## 🐛 Solución de Problemas

### Error de Conexión con el Backend
- Verifica que el backend esté corriendo en el puerto 4000
- Comprueba que las rutas de la API estén disponibles
- Revisa la consola del navegador para errores de red

### Productos No Se Cargan
- Verifica que la base de datos tenga productos
- Comprueba que las tablas estén sincronizadas
- Revisa los logs del backend

### Errores de TypeScript
- Ejecuta `npm run type-check` para verificar tipos
- Asegúrate de que todos los tipos estén correctamente definidos

## 📱 Responsive Design

La aplicación está optimizada para:
- **Móviles**: Diseño de una columna con navegación hamburguesa
- **Tablets**: Diseño de dos columnas
- **Desktop**: Diseño completo con sidebar de filtros

## 🔮 Próximas Funcionalidades

- [ ] Carrito de compras
- [ ] Sistema de autenticación
- [ ] Gestión de favoritos
- [ ] Filtros avanzados (precio, talles, colores)
- [ ] Paginación de productos
- [ ] Vista detallada del producto
- [ ] Sistema de reseñas y calificaciones

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes problemas o preguntas:
1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema
