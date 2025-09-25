# Test de Carga de Promociones desde Frontend

Este documento describe cómo probar la funcionalidad de creación de promociones desde el frontend.

## 📋 Archivos de Test

- `scripts/test-frontend-promocion.mjs` - Test completo con todos los endpoints
- `scripts/test-crear-promocion-simple.mjs` - Test simple de creación
- `test-promocion-frontend.bat` - Script de ejecución automática (Windows)

## 🚀 Ejecución Rápida

### Opción 1: Test Automático (Windows)
```bash
# Ejecutar el script batch
test-promocion-frontend.bat
```

### Opción 2: Test Manual
```bash
# Test simple
node scripts/test-crear-promocion-simple.mjs

# Test completo
node scripts/test-frontend-promocion.mjs
```

## 📋 Prerequisitos

1. **Backend ejecutándose** en `http://localhost:3000`
2. **Node.js instalado** con soporte para ES modules
3. **Dependencias instaladas** (`node-fetch` para las peticiones HTTP)

## 🔧 Instalación de Dependencias

Si no tienes `node-fetch` instalado:

```bash
npm install node-fetch
```

## 📊 Tests Incluidos

### Test Simple (`test-crear-promocion-simple.mjs`)

1. **Crear promoción** - Crea una nueva promoción de prueba
2. **Verificar promoción** - Confirma que se creó correctamente
3. **Validar código** - Prueba la validación del código de descuento

### Test Completo (`test-frontend-promocion.mjs`)

1. **Conexión al servidor** - Verifica que el backend esté funcionando
2. **Obtener promociones** - Lista promociones existentes
3. **Crear promoción** - Crea nueva promoción
4. **Verificar promoción** - Confirma la creación
5. **Validar código** - Prueba validación de descuento
6. **Obtener estadísticas** - Verifica estadísticas actualizadas
7. **Actualizar promoción** - Modifica la promoción creada
8. **Cambiar estado** - Cambia el estado de la promoción
9. **Eliminar promoción** - Limpia la promoción de prueba

## 📝 Datos de Prueba

El test crea una promoción con estos datos:

```json
{
  "nombre": "Promoción Test Frontend",
  "descripcion": "Promoción creada desde el frontend para pruebas",
  "tipo": "PORCENTAJE",
  "valor": 20.00,
  "codigo_descuento": "FRONTEND20",
  "fecha_inicio": "2025-01-15T...",
  "fecha_fin": "2025-01-30T...",
  "minimo_compra": 30.00,
  "uso_maximo": 25,
  "estado": "ACTIVA"
}
```

## ✅ Resultados Esperados

### Test Exitoso
```
✅ ¡Promoción creada exitosamente!
🆔 ID: 7
📋 Nombre: Promoción Test Frontend
🏷️  Código: FRONTEND20
💰 Descuento: 20%
📅 Válida hasta: 30/1/2025
```

### Test Fallido
```
❌ Error creando promoción:
Status: 500
Error: { error: "Error interno del servidor" }
```

## 🔍 Endpoints Probados

- `POST /api/marketing/promociones` - Crear promoción
- `GET /api/marketing/promociones/:id` - Obtener promoción
- `POST /api/marketing/validate-codigo` - Validar código
- `GET /api/marketing/stats` - Obtener estadísticas
- `PUT /api/marketing/promociones/:id` - Actualizar promoción
- `PATCH /api/marketing/promociones/:id/estado` - Cambiar estado
- `DELETE /api/marketing/promociones/:id` - Eliminar promoción

## 🐛 Solución de Problemas

### Error de Conexión
```
❌ Error de conexión: fetch failed
💡 Asegúrate de que el servidor esté ejecutándose en http://localhost:3000
```

**Solución:** Iniciar el backend con `npm start` o `node src/index.js`

### Error 404
```
❌ Error creando promoción:
Status: 404
Error: { error: "Ruta no encontrada" }
```

**Solución:** Verificar que el router de marketing esté configurado correctamente

### Error 500
```
❌ Error creando promoción:
Status: 500
Error: { error: "Error interno del servidor" }
```

**Solución:** Revisar logs del servidor y verificar la conexión a la base de datos

## 📞 Soporte

Si encuentras problemas:

1. Verifica que el backend esté ejecutándose
2. Revisa los logs del servidor
3. Confirma que la tabla `promociones` existe
4. Ejecuta el test de la base de datos primero

## 🎯 Próximos Pasos

Después de que el test pase exitosamente:

1. Integrar con el frontend real
2. Agregar validaciones adicionales
3. Implementar manejo de errores
4. Crear interfaz de usuario para gestión de promociones

