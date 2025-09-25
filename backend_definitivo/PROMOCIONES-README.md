# Módulo de Promociones - Guía de Instalación

Este módulo básico permite cargar y gestionar la tabla de promociones para el sistema de marketing.

## 📋 Archivos Incluidos

- `create-promociones-table.sql` - Script SQL para crear la tabla
- `scripts/load-promociones-data.js` - Script de carga de datos
- `scripts/test-promociones.mjs` - Script de pruebas
- `load-promociones.bat` - Script de instalación automática (Windows)

## 🚀 Instalación Rápida

### Opción 1: Instalación Automática (Windows)
```bash
# Ejecutar el script batch
load-promociones.bat
```

### Opción 2: Instalación Manual

1. **Crear la tabla:**
```bash
# Ejecutar el script SQL directamente en la base de datos
sqlite3 database.sqlite < create-promociones-table.sql
```

2. **Cargar datos de ejemplo:**
```bash
node scripts/load-promociones-data.js
```

3. **Ejecutar pruebas:**
```bash
node scripts/test-promociones.mjs
```

## 📊 Estructura de la Tabla

La tabla `promociones` incluye los siguientes campos:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_promocion` | INTEGER | ID único (auto-increment) |
| `nombre` | VARCHAR(100) | Nombre de la promoción |
| `descripcion` | TEXT | Descripción detallada |
| `tipo` | ENUM | Tipo: PORCENTAJE, MONTO_FIJO, 2X1, DESCUENTO_ESPECIAL |
| `valor` | DECIMAL(10,2) | Valor del descuento |
| `codigo_descuento` | VARCHAR(50) | Código único para aplicar |
| `fecha_inicio` | DATETIME | Fecha de inicio de la promoción |
| `fecha_fin` | DATETIME | Fecha de fin de la promoción |
| `minimo_compra` | DECIMAL(10,2) | Monto mínimo de compra |
| `uso_maximo` | INTEGER | Límite de usos |
| `uso_actual` | INTEGER | Usos actuales (default: 0) |
| `estado` | ENUM | Estado: ACTIVA, INACTIVA, EXPIRADA |
| `createdAt` | DATETIME | Fecha de creación |
| `updatedAt` | DATETIME | Fecha de actualización |

## 🎯 Datos de Ejemplo Incluidos

El script carga 6 promociones de ejemplo:

1. **Descuento 20% Verano** - `VERANO20` (20% descuento, min $50)
2. **Descuento Fijo $10** - `DESC10` ($10 fijo, min $30)
3. **2x1 en Camisetas** - `2X1CAMISETAS` (2x1, sin mínimo)
4. **Descuento VIP** - `VIP15` (15% descuento, min $100)
5. **Black Friday** - `BLACK30` (30% descuento, min $75) - INACTIVA
6. **Descuento Navidad** - `NAVIDAD25` (25% descuento, min $40) - INACTIVA

## ✅ Verificación

Después de la instalación, el script de prueba verificará:

- ✅ Existencia de la tabla
- ✅ Estructura correcta
- ✅ Datos cargados
- ✅ Validación de códigos de descuento
- ✅ Estadísticas básicas

## 🔧 Uso con el Backend

Una vez cargada la tabla, el módulo de marketing del backend podrá:

- Listar promociones
- Crear nuevas promociones
- Validar códigos de descuento
- Obtener estadísticas
- Gestionar estados

## 📝 Notas Importantes

- La tabla se crea con índices para optimizar consultas
- Los códigos de descuento son únicos
- Las fechas se validan automáticamente
- El estado por defecto es 'ACTIVA'

## 🐛 Solución de Problemas

Si encuentras errores:

1. Verifica que Node.js esté instalado
2. Asegúrate de que la base de datos `database.sqlite` existe
3. Revisa los permisos de escritura en el directorio
4. Ejecuta las pruebas para identificar problemas específicos

## 📞 Soporte

Para problemas o dudas, revisa los logs de error en la consola o contacta al equipo de desarrollo.

