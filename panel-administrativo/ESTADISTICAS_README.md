# 📊 Módulo de Estadísticas Empresariales

El módulo de estadísticas proporciona métricas clave para la toma de decisiones empresariales, conectándose directamente con el backend para obtener datos reales en tiempo real.

## 🎯 Características Principales

### **Métricas del Dashboard**
- **Ventas Totales**: Ingresos del período seleccionado con comparación mensual
- **Clientes Nuevos**: Nuevos registros con tendencia de crecimiento
- **Productos Vendidos**: Cantidad total de productos vendidos
- **Pedidos Completados**: Órdenes finalizadas exitosamente

### **Análisis Financiero**
- **Ingresos vs Gastos**: Comparación de flujo de caja
- **Ganancia Neta**: Beneficio real del negocio
- **Margen de Rentabilidad**: Porcentaje de ganancia sobre ventas
- **Alertas de Stock**: Productos con inventario bajo o agotado

### **Gráficos Interactivos**
- **Evolución de Ventas**: Gráfico de línea temporal
- **Distribución por Categorías**: Gráfico de dona
- **Productos Top**: Gráfico de barras horizontal
- **Tendencias Mensuales**: Comparación período a período

### **Insights Empresariales**
- **Recomendaciones Automáticas**: Basadas en análisis de datos
- **Alertas de Gestión**: Stock bajo, productos populares, etc.
- **Identificación de Oportunidades**: Clientes VIP, categorías de crecimiento
- **Análisis de Rentabilidad**: Sugerencias para mejorar márgenes

## 🔌 Endpoints de la API

### **Estadísticas Generales**
```
GET /api/estadisticas/generales?periodo=30
```
**Parámetros:**
- `periodo`: Días a analizar (7, 30, 90, 365)

**Respuesta:**
```json
{
  "ventasTotales": 45231,
  "clientesNuevos": 2350,
  "productosVendidos": 1234,
  "pedidosCompletados": 456,
  "cambioVentas": 20.1,
  "cambioClientes": 180.1,
  "cambioProductos": 19.0,
  "cambioPedidos": 12.0
}
```

### **Ventas Mensuales**
```
GET /api/estadisticas/ventas-mensuales?meses=12
```
**Parámetros:**
- `meses`: Número de meses a mostrar

**Respuesta:**
```json
[
  {
    "mes": "Ene",
    "ventas": 15000,
    "pedidos": 45
  }
]
```

### **Productos Más Vendidos**
```
GET /api/estadisticas/productos-top?limite=10
```
**Parámetros:**
- `limite`: Número máximo de productos a mostrar

**Respuesta:**
```json
[
  {
    "id_producto": 1,
    "descripcion": "Camiseta Azul",
    "ventas": 45,
    "porcentaje": 25,
    "stock": 50,
    "precio_venta": 25.99
  }
]
```

### **Categorías Top**
```
GET /api/estadisticas/categorias-top?limite=5
```

### **Clientes VIP**
```
GET /api/estadisticas/clientes-top?limite=10
```

### **Actividad Reciente**
```
GET /api/estadisticas/actividad-reciente?limite=20
```

### **Resumen Financiero**
```
GET /api/estadisticas/resumen-financiero?periodo=30
```

### **Estadísticas de Inventario**
```
GET /api/estadisticas/inventario
```

## 🎨 Componentes del Frontend

### **MetricCard**
Tarjeta individual para mostrar métricas con:
- Icono representativo
- Valor principal
- Cambio porcentual
- Indicador de tendencia
- Descripción opcional

### **Chart**
Componente de gráficos con soporte para:
- Gráficos de barras
- Gráficos de línea
- Gráficos de dona
- Personalización de colores y tamaños

### **Página Principal**
- Filtros de período (7, 30, 90, 365 días)
- Botón de actualización manual
- Layout responsive
- Estados de carga y error

## 📱 Funcionalidades para Decisiones Empresariales

### **1. Gestión de Inventario**
- **Alertas de Stock**: Identifica productos con inventario bajo
- **Productos Populares**: Enfoque en artículos de alta demanda
- **Rotación de Inventario**: Métricas de eficiencia del almacén

### **2. Análisis de Ventas**
- **Tendencias Temporales**: Patrones de venta por mes/día
- **Rendimiento por Categoría**: Identifica categorías de crecimiento
- **Comparación Períodos**: Análisis de mejora o declive

### **3. Gestión de Clientes**
- **Clientes VIP**: Identificación de compradores de alto valor
- **Retención**: Análisis de frecuencia de compra
- **Nuevos Clientes**: Tendencias de adquisición

### **4. Análisis Financiero**
- **Margen de Ganancia**: Rentabilidad del negocio
- **Flujo de Caja**: Ingresos vs gastos
- **ROI por Producto**: Retorno de inversión por artículo

## 🔧 Configuración

### **Backend**
El módulo requiere que el backend tenga:
- Base de datos con tablas: `productos`, `categorias`, `clientes`, `pedidos`, `detalle_pedidos`
- Relaciones configuradas entre modelos
- Endpoints de estadísticas funcionando

### **Frontend**
- Servicio de estadísticas configurado
- Componentes de gráficos importados
- Manejo de estados de carga y error

## 🚀 Uso del Módulo

### **Acceso**
1. Navegar a la sección "Estadísticas" en el panel administrativo
2. Seleccionar período de análisis
3. Los datos se cargan automáticamente
4. Usar botón "Actualizar" para refrescar datos

### **Interpretación de Datos**
- **Verde**: Indicadores positivos (crecimiento, ganancias)
- **Rojo**: Indicadores negativos (declive, pérdidas)
- **Azul**: Información neutral o de referencia
- **Naranja**: Alertas y advertencias

### **Toma de Decisiones**
- **Stock**: Reabastecer productos con inventario bajo
- **Marketing**: Enfocar en categorías de alto rendimiento
- **Precios**: Ajustar basado en análisis de rentabilidad
- **Clientes**: Desarrollar programas de fidelización

## 📊 Métricas Clave para el Negocio

### **KPIs Principales**
1. **Ventas Totales**: Ingresos del negocio
2. **Margen de Ganancia**: Rentabilidad operativa
3. **Rotación de Inventario**: Eficiencia del almacén
4. **Tasa de Conversión**: Efectividad de ventas
5. **Valor del Cliente**: Ingresos por cliente

### **Alertas Automáticas**
- Productos con stock bajo (≤10 unidades)
- Productos agotados
- Categorías con bajo rendimiento
- Clientes inactivos por largo tiempo

## 🔮 Próximas Funcionalidades

- [ ] **Predicciones**: Análisis predictivo de ventas
- [ ] **Reportes PDF**: Exportación de estadísticas
- [ ] **Dashboard Personalizable**: Métricas configurables por usuario
- [ ] **Alertas en Tiempo Real**: Notificaciones push de métricas críticas
- [ ] **Análisis de Competencia**: Benchmarking del mercado
- [ ] **Integración con CRM**: Datos de clientes más detallados

## 🐛 Solución de Problemas

### **Datos No Se Cargan**
1. Verificar conexión con el backend
2. Comprobar que las tablas de BD existan
3. Revisar logs del servidor
4. Verificar permisos de usuario

### **Gráficos No Se Muestran**
1. Verificar que los datos lleguen correctamente
2. Comprobar formato de datos para gráficos
3. Revisar consola del navegador
4. Verificar importación de componentes

### **Métricas Incorrectas**
1. Verificar cálculos en el backend
2. Comprobar relaciones entre modelos
3. Revisar filtros de fecha
4. Verificar estados de pedidos

## 📞 Soporte

Para problemas técnicos:
1. Revisar logs del backend
2. Verificar consola del navegador
3. Comprobar conectividad de la API
4. Validar estructura de la base de datos

---

**El módulo de estadísticas proporciona la información necesaria para tomar decisiones empresariales informadas y basadas en datos reales.** 📈
