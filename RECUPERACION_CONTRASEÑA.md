# Configuración de Recuperación de Contraseña con EmailJS

## Funcionalidad Implementada

Se ha implementado un sistema completo de recuperación de contraseña para clientes que incluye:

### Backend
- ✅ Endpoints de recuperación de contraseña (`/api/clientes/auth/forgot-password`)
- ✅ Verificación de tokens de recuperación (`/api/clientes/auth/reset-password/:token`)
- ✅ Cambio de contraseña con token (`/api/clientes/auth/reset-password`)
- ✅ Generación de tokens seguros con expiración (30 minutos)
- ✅ Validación de usuarios y estados de cuenta

### Frontend
- ✅ Componente `ForgotPassword.tsx` con interfaz moderna
- ✅ Integración con servicios de autenticación
- ✅ Enlace "¿Olvidaste tu contraseña?" en el login
- ✅ Flujo completo de recuperación en 2 pasos
- ✅ Manejo de errores y estados de carga

### EmailJS
- ✅ Servicio de envío de emails (`emailService.ts`)
- ✅ Templates para emails de recuperación
- ✅ Configuración flexible para desarrollo/producción

## Configuración de EmailJS

### 1. Crear cuenta en EmailJS
1. Ve a [EmailJS.com](https://www.emailjs.com/)
2. Crea una cuenta gratuita
3. Verifica tu email

### 2. Configurar servicio de email
1. En el dashboard, ve a **Email Services**
2. Agrega un servicio (Gmail, Outlook, etc.)
3. Sigue las instrucciones para conectar tu cuenta de email
4. Anota el **Service ID**

### 3. Crear template de email
1. Ve a **Email Templates**
2. Crea un nuevo template
3. Usa este contenido como base:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Recuperar Contraseña - Tienda de Ropa</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb;">🛍️ Tienda de Ropa</h1>
        </div>
        
        <h2>Recuperar Contraseña</h2>
        
        <p>Hola {{to_name}},</p>
        
        <p>Has solicitado recuperar tu contraseña. Para continuar, haz clic en el siguiente enlace:</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{reset_url}}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Recuperar Contraseña
            </a>
        </div>
        
        <p><strong>Enlace directo:</strong><br>
        <a href="{{reset_url}}">{{reset_url}}</a></p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">
                <strong>⚠️ Importante:</strong> Este enlace expira en 30 minutos por seguridad.
            </p>
        </div>
        
        <p>Si no solicitaste este cambio, puedes ignorar este email.</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #6b7280; text-align: center;">
            Este email fue enviado automáticamente. No respondas a este mensaje.
        </p>
    </div>
</body>
</html>
```

4. Anota el **Template ID**

### 4. Obtener Public Key
1. Ve a **Account** → **General**
2. Copia tu **Public Key**

### 5. Configurar en el código
Edita el archivo `tienda-ropa/src/services/emailService.ts` y reemplaza:

```typescript
const EMAILJS_CONFIG = {
    serviceId: 'tu_service_id', // ← Reemplaza con tu Service ID
    templateId: 'tu_template_id', // ← Reemplaza con tu Template ID
    publicKey: 'tu_public_key' // ← Reemplaza con tu Public Key
};
```

## Variables del Template

El template de EmailJS debe incluir estas variables:

- `{{to_email}}` - Email del destinatario
- `{{to_name}}` - Nombre completo del cliente
- `{{reset_url}}` - URL completa del enlace de recuperación
- `{{reset_token}}` - Token de recuperación (para debugging)
- `{{from_name}}` - Nombre de la tienda
- `{{message}}` - Mensaje personalizado

## Flujo de Recuperación

1. **Cliente hace clic en "¿Olvidaste tu contraseña?"**
2. **Ingresa su email** en el formulario
3. **Backend genera token** único y temporal (30 min)
4. **EmailJS envía email** con enlace de recuperación
5. **Cliente hace clic en el enlace** del email
6. **Frontend verifica token** y muestra formulario de nueva contraseña
7. **Cliente ingresa nueva contraseña** y confirma
8. **Backend actualiza contraseña** y elimina token

## URLs de Recuperación

- **Solicitar recuperación:** `/forgot-password`
- **Cambiar contraseña:** `/reset-password?token=ABC123`

## Modo Desarrollo

Si EmailJS no está configurado, el sistema funciona en modo simulación:
- Los tokens se generan normalmente
- Los emails se "envían" solo en consola
- El flujo completo funciona para testing

## Seguridad

- ✅ Tokens únicos y aleatorios (32 bytes)
- ✅ Expiración automática (30 minutos)
- ✅ Validación de usuarios activos
- ✅ Limpieza de tokens usados/expirados
- ✅ Encriptación de contraseñas con bcrypt

## Testing

Para probar la funcionalidad:

1. Ve al login de clientes
2. Haz clic en "¿Olvidaste tu contraseña?"
3. Ingresa un email válido de cliente
4. Revisa la consola para ver el token generado
5. Usa el token en la URL: `/reset-password?token=TOKEN_AQUI`
6. Cambia la contraseña

¡La funcionalidad está lista para usar! 🎉

