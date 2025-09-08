# 🧪 Test del Módulo de Ventas

Este directorio contiene scripts para probar el funcionamiento del módulo de ventas y su conexión con la base de datos.

## 📋 Archivos de Test

- `test-ventas-simple.js` - Test básico de conexión
- `test-ventas.js` - Test completo con todas las operaciones CRUD
- `test-ventas.bat` - Script de ejecución para Windows
- `test-ventas.ps1` - Script de PowerShell para Windows

## 🚀 Cómo Ejecutar los Tests

### Opción 1: Script de Windows (Recomendado)
```bash
# Doble clic en el archivo o ejecutar desde cmd:
test-ventas.bat
```

### Opción 2: PowerShell
```powershell
# Ejecutar desde PowerShell:
.\test-ventas.ps1
```

### Opción 3: Manual con Node.js
```bash
# Instalar dependencias (solo la primera vez):
npm install axios

# Ejecutar test simple:
node test-ventas-simple.js

# Ejecutar test completo:
node test-ventas.js
```

## 🔍 Qué Verifica el Test

### Test Simple (`test-ventas-simple.js`)
- ✅ Conexión con el servidor backend
- ✅ Respuesta del endpoint `/facturas`
- ✅ Estructura de datos correcta
- ✅ Información de facturas existentes

### Test Completo (`test-ventas.js`)
- ✅ Conexión con servidor
- ✅ Conexión con base de datos
- ✅ Obtención de facturas
- ✅ Creación de factura de prueba
- ✅ Obtención de factura específica
- ✅ Actualización de factura
- ✅ Eliminación de factura (limpieza)

## 📊 Interpretación de Resultados

### ✅ Éxito
```
✅ Servidor conectado correctamente
✅ Respuesta es un array con X facturas
🎉 TEST COMPLETADO EXITOSAMENTE
```

### ❌ Error de Conexión
```
❌ ERROR EN EL TEST
💥 Error: connect ECONNREFUSED
🔌 El servidor no está ejecutándose en http://localhost:4000
```

### ⚠️ Problemas de Datos
```
⚠️ La respuesta no es un array
⚠️ No hay facturas en la base de datos
```

## 🛠️ Solución de Problemas

### Error: "Node.js no está instalado"
- Descargar e instalar Node.js desde https://nodejs.org/
- Reiniciar la terminal/consola

### Error: "ECONNREFUSED"
- Verificar que el backend esté ejecutándose en http://localhost:4000
- Ejecutar: `cd backend_definitivo && npm start`

### Error: "axios no está instalado"
- Ejecutar: `npm install axios`
- O usar el script `.bat` que instala automáticamente

### Error: "No hay facturas"
- Normal si es la primera vez que se ejecuta
- Crear algunas facturas desde el POS o panel administrativo

## 📝 Notas Importantes

1. **Backend Requerido**: El test necesita que el backend esté ejecutándose
2. **Puerto 4000**: Asegúrate de que el backend use el puerto 4000
3. **Base de Datos**: El test verifica la conexión con la base de datos
4. **Datos de Prueba**: El test completo crea y elimina una factura de prueba

## 🔧 Personalización

Para cambiar la URL del servidor, edita la variable `API_BASE_URL` en los archivos de test:

```javascript
const API_BASE_URL = 'http://localhost:4000'; // Cambiar aquí
```

## 📞 Soporte

Si encuentras problemas:
1. Verifica que el backend esté ejecutándose
2. Revisa los logs del servidor
3. Confirma que la base de datos esté accesible
4. Ejecuta el test simple primero para diagnóstico básico





