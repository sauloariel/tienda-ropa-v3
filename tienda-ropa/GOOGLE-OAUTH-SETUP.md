# 🔐 Configuración de Google OAuth

## 📋 Pasos para Configurar Google OAuth

### **1. Crear Proyecto en Firebase**

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Crear proyecto"
3. Ingresa el nombre del proyecto (ej: "tienda-ropa-auth")
4. Habilita Google Analytics (opcional)
5. Haz clic en "Crear proyecto"

### **2. Configurar Authentication**

1. En el panel de Firebase, ve a **Authentication**
2. Haz clic en **"Comenzar"**
3. Ve a la pestaña **"Sign-in method"**
4. Habilita **"Google"**
5. Configura:
   - **Nombre del proyecto**: Tu tienda
   - **Email de soporte**: tu-email@ejemplo.com
6. Haz clic en **"Guardar"**

### **3. Configurar la Aplicación Web**

1. En el panel de Firebase, haz clic en el ícono **"</>"** (Web)
2. Ingresa un nombre para tu app (ej: "tienda-ropa-web")
3. **NO** marques "También configura Firebase Hosting"
4. Haz clic en **"Registrar app"**
5. Copia la configuración que aparece

### **4. Actualizar la Configuración**

Reemplaza los valores en `tienda-ropa/src/services/firebaseConfig.ts`:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // Tu API Key
  authDomain: "tu-proyecto.firebaseapp.com", // Tu dominio
  projectId: "tu-proyecto-id", // Tu Project ID
  storageBucket: "tu-proyecto.appspot.com", // Tu Storage Bucket
  messagingSenderId: "123456789012", // Tu Sender ID
  appId: "1:123456789012:web:abcdefghijklmnop" // Tu App ID
};
```

### **5. Configurar Dominios Autorizados**

1. En Firebase Console → **Authentication** → **Settings**
2. En **"Authorized domains"**, agrega:
   - `localhost` (para desarrollo)
   - Tu dominio de producción (ej: `tu-tienda.com`)

### **6. Configurar el Backend (Opcional)**

Si quieres sincronizar usuarios de Google con tu base de datos:

1. **Modifica el backend** para aceptar usuarios de Google
2. **Agrega campos** para `google_id`, `google_photo`, etc.
3. **Actualiza el modelo** de Clientes

### **7. Probar la Configuración**

1. **Inicia el servidor**: `npm run dev`
2. **Ve a la tienda**: `http://localhost:5173`
3. **Haz clic en "Continuar con Google"**
4. **Selecciona tu cuenta** de Google
5. **Verifica** que te loguee correctamente

## 🎯 Características del Sistema

### **✅ Ventajas de Google OAuth:**

- **🔐 Seguro**: Google maneja la autenticación
- **⚡ Rápido**: Un clic para iniciar sesión
- **📧 Verificado**: Email automáticamente verificado
- **👤 Datos**: Nombre, email y foto automáticos
- **🔄 Persistente**: Sesión mantenida entre recargas

### **📱 Datos del Usuario:**

Cuando un usuario se loguea con Google, obtienes:
- **Nombre completo**
- **Email verificado**
- **Foto de perfil**
- **ID único de Google**

### **🛠️ Personalización:**

Puedes personalizar:
- **Scopes**: Qué información solicitar
- **Dominios**: Dónde funciona la autenticación
- **UI**: Apariencia del botón de Google
- **Datos**: Qué información guardar en tu BD

## 🚀 ¡Listo para Usar!

Una vez configurado, los usuarios podrán:
1. **Hacer clic** en "Continuar con Google"
2. **Seleccionar** su cuenta de Google
3. **Acceder** automáticamente a la tienda
4. **Comprar** productos sin registro manual

**¡El sistema de autenticación con Google está completamente integrado!** 🎉
