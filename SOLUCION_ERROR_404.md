# 🔧 Solución al Error 404 de EmailJS

## 🚨 **Problema Identificado**
El error 404 indica que **el Service ID o Template ID son incorrectos** o no existen en tu cuenta de EmailJS.

## 📋 **Pasos para Verificar y Corregir**

### 1. **Verificar Service ID**
1. Ve a tu cuenta de EmailJS
2. Ve a **"Email Services"** en el menú lateral
3. Busca tu servicio (probablemente Gmail)
4. **Copia el Service ID exacto** (debe empezar con `service_`)

### 2. **Verificar Template ID**
1. Ve a **"Email Templates"** en el menú lateral
2. Busca tu template "Password Reset"
3. **Copia el Template ID exacto** (debe empezar con `template_`)

### 3. **Verificar Public Key**
1. Ve a **"Account"** → **"General"**
2. **Copia tu Public Key** (debe ser una cadena de caracteres)

## 🔍 **Valores Actuales en tu Código**
```typescript
const EMAILJS_CONFIG = {
    serviceId: 'service_qxnyfzk',     // ← Verifica este valor
    templateId: 'template_8iekr2x',   // ← Verifica este valor  
    publicKey: 'CIEawmID0xf-HI2L1'    // ← Verifica este valor
};
```

## ✅ **Valores Correctos que Deberías Tener**

### Service ID
- ✅ **Correcto:** `service_xxxxxxxxx`
- ❌ **Incorrecto:** `service_qxnyfzk` (si no existe en tu cuenta)

### Template ID  
- ✅ **Correcto:** `template_xxxxxxxxx`
- ❌ **Incorrecto:** `template_8iekr2x` (si no existe en tu cuenta)

### Public Key
- ✅ **Correcto:** `xxxxxxxxxxxxxxxxx` (cadena de caracteres)
- ❌ **Incorrecto:** `CIEawmID0xf-HI2L1` (si no es tu key real)

## 🛠️ **Cómo Corregir**

1. **Obtén los valores correctos** de tu cuenta de EmailJS
2. **Actualiza el archivo** `tienda-ropa/src/services/emailService.ts`
3. **Reemplaza los valores** en la sección `EMAILJS_CONFIG`

## 🧪 **Para Probar**

1. **Abre la consola del navegador** (F12)
2. **Intenta recuperar contraseña** 
3. **Revisa los logs** que ahora son más detallados
4. **Busca estos mensajes**:
   - `🔍 Verificando configuración de EmailJS...`
   - `📋 Configuración actual:`
   - `🚨 Error 404: Verifica que el Service ID y Template ID sean correctos`

## 📞 **Si Sigues Teniendo Problemas**

1. **Verifica que el template existe** en EmailJS
2. **Verifica que el servicio está activo** en EmailJS  
3. **Verifica que tu dominio está autorizado** en EmailJS
4. **Prueba con un template simple** primero

## 🎯 **Template de Prueba Simple**

Si quieres probar con un template más simple, puedes crear uno nuevo en EmailJS con este contenido:

**Subject:** `Prueba de Email`
**Content:** `Hola {{to_name}}, este es un email de prueba.`

Y usar ese Template ID para probar que la conexión funciona.

---

**¿Puedes verificar estos valores en tu cuenta de EmailJS y decirme cuáles son los correctos?**

