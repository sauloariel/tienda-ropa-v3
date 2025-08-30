# 🔐 Sistema de Recuperación de Contraseña - Panel Administrativo

## 📋 Descripción

Sistema completo de recuperación de contraseña implementado en el panel administrativo de la tienda de ropa. Permite a los usuarios recuperar su contraseña de forma segura mediante tokens únicos y temporales.

## ✨ Características Principales

### 🔑 **Autenticación Básica**
- Login con usuario y contraseña
- Generación de tokens JWT
- Verificación de tokens
- Logout funcional
- Cambio de contraseña (usuario autenticado)

### 🔄 **Recuperación de Contraseña**
- Solicitud de recuperación por nombre de usuario
- Generación de tokens únicos y seguros
- Verificación de tokens antes de permitir cambio
- Cambio de contraseña con token de recuperación
- Tokens con expiración automática (30 minutos)

### 🛡️ **Seguridad**
- Contraseñas hasheadas con bcrypt
- Tokens JWT seguros
- Tokens de recuperación únicos y temporales
- Validación de entrada robusta
- Control de acceso por roles

## 🚀 **Instalación y Configuración**

### 1. **Dependencias del Backend**
```bash
cd backend_definitivo
npm install bcrypt jsonwebtoken @types/jsonwebtoken
```

### 2. **Inicializar Usuarios de Prueba**
```bash
node init-users.js
```

### 3. **Iniciar Backend**
```bash
npm run dev
```

### 4. **Iniciar Frontend**
```bash
cd ../panel-administrativo
npm run dev
```

## 📡 **API Endpoints**

### **Autenticación**
- `POST /api/login/auth/login` - Login de usuario
- `GET /api/login/auth/verify` - Verificar token
- `POST /api/login/auth/logout` - Logout
- `GET /api/login/auth/me` - Obtener usuario actual
- `PUT /api/login/auth/change-password` - Cambiar contraseña

### **Recuperación de Contraseña**
- `POST /api/login/auth/forgot-password` - Solicitar recuperación
- `GET /api/login/auth/reset-password/:resetToken` - Verificar token
- `POST /api/login/auth/reset-password` - Cambiar contraseña con token

## 🔧 **Flujo de Recuperación de Contraseña**

### **Paso 1: Solicitud de Recuperación**
1. Usuario ingresa su nombre de usuario
2. Sistema verifica que el usuario existe y esté activo
3. Se genera un token único de recuperación
4. Token se almacena temporalmente (en producción usar Redis)
5. Se envía confirmación al usuario

### **Paso 2: Verificación del Token**
1. Usuario accede al enlace con el token
2. Sistema verifica que el token sea válido y no haya expirado
3. Si es válido, se permite el cambio de contraseña

### **Paso 3: Cambio de Contraseña**
1. Usuario ingresa nueva contraseña y confirmación
2. Sistema valida que las contraseñas coincidan
3. Se encripta la nueva contraseña
4. Se actualiza la base de datos
5. Se elimina el token usado
6. Usuario es redirigido al login

## 👥 **Usuarios de Prueba**

### **Usuario Vendedor**
- **Usuario:** `lucia`
- **Contraseña:** `lucia123`
- **Rol:** VENDEDOR
- **Email:** lucia@tienda.com

### **Usuario Administrador**
- **Usuario:** `admin`
- **Contraseña:** `admin123`
- **Rol:** ADMIN
- **Email:** admin@tienda.com

## 🧪 **Pruebas del Sistema**

### **Prueba de Recuperación de Contraseña**
```bash
cd backend_definitivo
node test-password-recovery.js
```

### **Prueba de Login Básico**
```bash
cd backend_definitivo
node test-login.js
```

## 🔒 **Configuración de Seguridad**

### **Variables de Entorno (.env)**
```env
JWT_SECRET=tu_secreto_jwt_super_seguro_2024_tienda_ropa
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=10
```

### **Configuración de Tokens**
- **JWT:** 24 horas de duración
- **Recuperación:** 30 minutos de duración
- **Bcrypt:** 10 rondas de hashing

## 🎯 **Uso del Frontend**

### **Componente ForgotPassword**
- Formulario de solicitud de recuperación
- Formulario de cambio de contraseña
- Validaciones en tiempo real
- Manejo de errores y mensajes
- Redirecciones automáticas

### **Integración con Login**
- Botón "¿Olvidaste tu contraseña?"
- Navegación entre login y recuperación
- Estados de carga apropiados
- Feedback visual inmediato

## 🚨 **Consideraciones de Producción**

### **Almacenamiento de Tokens**
- **Desarrollo:** Map en memoria
- **Producción:** Redis o base de datos
- **Expiración:** Automática y limpieza periódica

### **Envío de Emails**
- **Desarrollo:** Log en consola
- **Producción:** Servicio de email (SendGrid, AWS SES, etc.)
- **Plantillas:** HTML responsivo y personalizado

### **Seguridad Adicional**
- Rate limiting en endpoints de recuperación
- Logs de auditoría
- Monitoreo de intentos fallidos
- Blacklist de tokens comprometidos

## 📱 **Responsive Design**

- **Mobile First:** Diseño optimizado para móviles
- **Tablet:** Adaptación para pantallas medianas
- **Desktop:** Experiencia completa en pantallas grandes
- **Accesibilidad:** Navegación por teclado y lectores de pantalla

## 🔍 **Troubleshooting**

### **Problemas Comunes**

1. **Token expirado**
   - Solución: Solicitar nuevo token de recuperación

2. **Usuario no encontrado**
   - Verificar que el nombre de usuario sea correcto
   - Confirmar que el empleado esté activo

3. **Error de conexión**
   - Verificar que el backend esté ejecutándose
   - Comprobar la configuración de CORS

4. **Contraseña no válida**
   - Mínimo 6 caracteres
   - Las contraseñas deben coincidir

## 📞 **Soporte**

Para soporte técnico o reportar problemas:
- Revisar logs del backend
- Verificar configuración de base de datos
- Comprobar conectividad de red
- Validar formato de datos enviados

---

**🎉 ¡Sistema de recuperación de contraseña implementado exitosamente!**
