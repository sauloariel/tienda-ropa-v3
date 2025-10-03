# Template de EmailJS para Recuperación de Contraseña

## Template HTML Completo

Copia y pega este código en tu template de EmailJS:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperar Contraseña - Tienda de Ropa</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f8fafc;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 16px;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #1f2937;
        }
        .message {
            font-size: 16px;
            margin-bottom: 30px;
            color: #4b5563;
        }
        .button-container {
            text-align: center;
            margin: 40px 0;
        }
        .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
            transition: all 0.3s ease;
        }
        .reset-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
        }
        .link-container {
            background-color: #f3f4f6;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
        }
        .link-container p {
            margin: 0 0 10px 0;
            font-weight: 600;
            color: #374151;
        }
        .link-container a {
            color: #2563eb;
            word-break: break-all;
            text-decoration: none;
        }
        .warning {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 16px;
            margin: 30px 0;
        }
        .warning-icon {
            display: inline-block;
            width: 20px;
            height: 20px;
            background-color: #f59e0b;
            border-radius: 50%;
            color: white;
            text-align: center;
            line-height: 20px;
            font-weight: bold;
            margin-right: 8px;
        }
        .warning p {
            margin: 0;
            font-size: 14px;
            color: #92400e;
        }
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer p {
            margin: 0;
            font-size: 12px;
            color: #6b7280;
        }
        .divider {
            height: 1px;
            background-color: #e5e7eb;
            margin: 30px 0;
        }
        .steps {
            background-color: #f8fafc;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
        }
        .steps h3 {
            margin: 0 0 15px 0;
            color: #1f2937;
            font-size: 16px;
        }
        .step {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            font-size: 14px;
            color: #4b5563;
        }
        .step-number {
            background-color: #2563eb;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 12px;
            margin-right: 12px;
        }
        @media (max-width: 600px) {
            .container {
                margin: 10px;
                border-radius: 8px;
            }
            .content {
                padding: 30px 20px;
            }
            .header {
                padding: 20px 15px;
            }
            .header h1 {
                font-size: 24px;
            }
            .reset-button {
                padding: 14px 28px;
                font-size: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>🛍️ Tienda de Ropa</h1>
            <p>Recuperación de Contraseña</p>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">
                Hola {{to_name}},
            </div>

            <div class="message">
                Has solicitado recuperar tu contraseña en nuestra tienda. Para continuar con el proceso de recuperación, haz clic en el botón de abajo.
            </div>

            <!-- Reset Button -->
            <div class="button-container">
                <a href="{{reset_url}}" class="reset-button">
                    🔐 Recuperar Mi Contraseña
                </a>
            </div>

            <!-- Steps -->
            <div class="steps">
                <h3>📋 Pasos para recuperar tu contraseña:</h3>
                <div class="step">
                    <div class="step-number">1</div>
                    <span>Haz clic en el botón "Recuperar Mi Contraseña"</span>
                </div>
                <div class="step">
                    <div class="step-number">2</div>
                    <span>Ingresa tu nueva contraseña</span>
                </div>
                <div class="step">
                    <div class="step-number">3</div>
                    <span>Confirma tu nueva contraseña</span>
                </div>
                <div class="step">
                    <div class="step-number">4</div>
                    <span>¡Listo! Ya puedes iniciar sesión con tu nueva contraseña</span>
                </div>
            </div>

            <!-- Direct Link -->
            <div class="link-container">
                <p>🔗 Enlace directo:</p>
                <a href="{{reset_url}}">{{reset_url}}</a>
            </div>

            <!-- Warning -->
            <div class="warning">
                <p>
                    <span class="warning-icon">⚠</span>
                    <strong>Importante:</strong> Este enlace es válido por 30 minutos por seguridad. Si no solicitaste este cambio, puedes ignorar este email.
                </p>
            </div>

            <div class="divider"></div>

            <div class="message">
                <strong>¿Necesitas ayuda?</strong><br>
                Si tienes problemas para recuperar tu contraseña o no solicitaste este cambio, contáctanos inmediatamente.
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>
                Este email fue enviado automáticamente desde Tienda de Ropa.<br>
                No respondas a este mensaje. Si necesitas ayuda, contáctanos desde nuestro sitio web.
            </p>
        </div>
    </div>
</body>
</html>
```

## Variables del Template

Asegúrate de que tu template de EmailJS incluya estas variables:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{to_name}}` | Nombre completo del cliente | Juan Pérez |
| `{{to_email}}` | Email del destinatario | juan@email.com |
| `{{reset_url}}` | URL completa del enlace de recuperación | https://tutienda.com/reset-password?token=abc123 |
| `{{reset_token}}` | Token de recuperación (para debugging) | abc123def456... |
| `{{from_name}}` | Nombre de la tienda | Tienda de Ropa |
| `{{message}}` | Mensaje personalizado | Recuperación solicitada |

## Configuración en EmailJS

1. **Ve a Email Templates** en tu dashboard de EmailJS
2. **Crea un nuevo template**
3. **Copia y pega** el código HTML de arriba
4. **Configura las variables** en la sección "Variables"
5. **Guarda el template**
6. **Copia el Template ID** para usar en tu código

## Template Alternativo (Más Simple)

Si prefieres algo más simple, aquí tienes una versión minimalista:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Recuperar Contraseña</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; background-color: #2563eb; color: white; padding: 30px; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0;">🛍️ Tienda de Ropa</h1>
        <p style="margin: 10px 0 0 0;">Recuperación de Contraseña</p>
    </div>
    
    <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2>Hola {{to_name}},</h2>
        
        <p>Has solicitado recuperar tu contraseña. Para continuar, haz clic en el siguiente enlace:</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{reset_url}}" 
               style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                🔐 Recuperar Contraseña
            </a>
        </div>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px;">
                <strong>Enlace directo:</strong><br>
                <a href="{{reset_url}}">{{reset_url}}</a>
            </p>
        </div>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #92400e;">
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

## Próximos Pasos

1. **Copia uno de los templates** de arriba
2. **Créalo en EmailJS** con las variables necesarias
3. **Actualiza la configuración** en `tienda-ropa/src/services/emailService.ts`
4. **Prueba el envío** de emails de recuperación

¡Con estos templates tendrás emails profesionales y funcionales para la recuperación de contraseñas! 🎉

