# 🔐 Configuración del Sistema de Login

## 🚨 **Problema Identificado**

El sistema no puede conectarse con la base de datos real del backend. Esto puede deberse a varios factores:

## 🔍 **Diagnóstico del Problema**

### **1. Verificar que el Backend esté Funcionando**
```bash
# Verificar que el backend esté corriendo en el puerto 3000
curl http://localhost:3000/api/loguin/login
```

### **2. Verificar la Estructura de la Respuesta del Backend**
El sistema espera diferentes estructuras de respuesta. Abre la consola del navegador (F12) y revisa los logs cuando intentes hacer login.

## 🛠️ **Soluciones**

### **Opción 1: Configurar Variables de Entorno**
Crea un archivo `.env` en la raíz del proyecto:

```bash
# panel-administrativo/.env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_DEBUG_MODE=true
```

### **Opción 2: Verificar la URL del Backend**
En `src/config/config.ts`, asegúrate de que la URL sea correcta:

```typescript
export const config = {
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 10000,
  }
}
```

### **Opción 3: Verificar el Endpoint de Login**
El sistema está configurado para usar `/loguin/login`. Verifica que este endpoint exista en tu backend.

## 🧪 **Testing del Login**

### **1. Credenciales de Prueba (Mock)**
```bash
# Administrador
Usuario: admin
Contraseña: admin

# Vendedor
Usuario: vendedor
Contraseña: vendedor

# Inventario
Usuario: inventario
Contraseña: inventario
```

### **2. Credenciales del Backend Real**
Usa las credenciales que tengas en tu base de datos. El sistema intentará conectarse primero con el backend real.

## 🔧 **Debugging**

### **1. Abrir Consola del Navegador**
- Presiona F12
- Ve a la pestaña "Console"
- Intenta hacer login
- Revisa los logs que aparecen

### **2. Logs Esperados**
```
Attempting to login with backend...
Sending login request to: http://localhost:3000/api/loguin/login
Credentials: { usuario: "tu_usuario", passwd: "***" }
API Request: { method: "POST", url: "/loguin/login", ... }
```

### **3. Posibles Errores**
- **CORS Error**: El backend no permite peticiones desde el frontend
- **Connection Refused**: El backend no está corriendo
- **404 Not Found**: El endpoint no existe
- **500 Internal Server Error**: Error en el backend

## 🚀 **Pasos para Solucionar**

### **Paso 1: Verificar Backend**
```bash
# En la carpeta backend_definitivo
npm start
# o
node src/server.js
```

### **Paso 2: Verificar Endpoint**
```bash
# Probar el endpoint manualmente
curl -X POST http://localhost:3000/api/loguin/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"tu_usuario","passwd":"tu_password"}'
```

### **Paso 3: Verificar CORS**
En tu backend, asegúrate de que CORS esté configurado para permitir peticiones desde `http://localhost:1420`.

### **Paso 4: Verificar Estructura de Respuesta**
El backend debe devolver una respuesta con esta estructura:

```json
{
  "success": true,
  "user": {
    "id_loguin": 1,
    "usuario": "admin",
    "id_rol": 1,
    "empleado": {
      "nombre": "Admin",
      "apellido": "User"
    }
  }
}
```

O alternativamente:

```json
{
  "id_loguin": 1,
  "usuario": "admin",
  "id_rol": 1,
  "empleado": {
    "nombre": "Admin",
    "apellido": "User"
  }
}
```

## 📋 **Checklist de Verificación**

- [ ] Backend corriendo en puerto 3000
- [ ] Endpoint `/api/loguin/login` existe y funciona
- [ ] CORS configurado correctamente
- [ ] Estructura de respuesta correcta
- [ ] Variables de entorno configuradas
- [ ] Consola del navegador abierta para debugging

## 🆘 **Si Nada Funciona**

### **Usar Sistema Mock Temporalmente**
El sistema tiene un fallback a credenciales mock que te permitirá probar la funcionalidad mientras resuelves el problema de conexión.

### **Verificar Logs del Backend**
Revisa los logs del backend para ver si está recibiendo las peticiones de login.

### **Probar con Postman/Insomnia**
Usa una herramienta como Postman para probar el endpoint del backend directamente.

## 🔄 **Reiniciar el Sistema**

Después de hacer cambios:

1. Detén el frontend (Ctrl+C)
2. Detén el backend (Ctrl+C)
3. Reinicia el backend: `npm start`
4. Reinicia el frontend: `npm run dev`
5. Limpia el localStorage del navegador
6. Intenta login nuevamente

---

**¿Necesitas ayuda adicional? Revisa los logs en la consola del navegador y compártelos para mejor diagnóstico.**

