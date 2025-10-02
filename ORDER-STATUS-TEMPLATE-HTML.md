# Template HTML para Order Status Notification

## 📧 Contenido del Template en EmailJS

**Template ID:** `template_order_status`  
**Nombre:** Order Status Notification

### HTML del Template:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Actualización de Pedido - {{company_name}}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #007bff;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 10px;
        }
        .status-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 14px;
        }
        .status-procesando { background-color: #fff3cd; color: #856404; }
        .status-completado { background-color: #d4edda; color: #155724; }
        .status-entregado { background-color: #d1ecf1; color: #0c5460; }
        .status-cancelado { background-color: #f8d7da; color: #721c24; }
        .order-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .order-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 20px 0;
        }
        .detail-item {
            padding: 10px;
            background-color: #f8f9fa;
            border-radius: 5px;
        }
        .detail-label {
            font-weight: bold;
            color: #666;
            font-size: 12px;
            text-transform: uppercase;
        }
        .detail-value {
            font-size: 16px;
            color: #333;
            margin-top: 5px;
        }
        .message-box {
            background-color: #e7f3ff;
            border-left: 4px solid #007bff;
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 5px 5px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 12px;
        }
        .button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
        }
        .button:hover {
            background-color: #0056b3;
        }
        @media (max-width: 600px) {
            .order-details {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo">{{company_name}}</div>
            <h1>Actualización de Pedido</h1>
        </div>

        <!-- Saludo -->
        <p>Hola <strong>{{to_name}}</strong>,</p>

        <!-- Mensaje personalizado -->
        <div class="message-box">
            <p><strong>{{message}}</strong></p>
        </div>

        <!-- Estado del pedido -->
        <div style="text-align: center; margin: 30px 0;">
            <span class="status-badge status-{{order_status}}">
                Estado: {{order_status}}
            </span>
        </div>

        <!-- Información del pedido -->
        <div class="order-info">
            <h3 style="margin-top: 0; color: #333;">Detalles del Pedido</h3>
            
            <div class="order-details">
                <div class="detail-item">
                    <div class="detail-label">Número de Pedido</div>
                    <div class="detail-value">#{{order_id}}</div>
                </div>
                
                <div class="detail-item">
                    <div class="detail-label">Fecha del Pedido</div>
                    <div class="detail-value">{{order_date}}</div>
                </div>
                
                <div class="detail-item">
                    <div class="detail-label">Estado Actual</div>
                    <div class="detail-value">{{order_status}}</div>
                </div>
                
                <div class="detail-item">
                    <div class="detail-label">Total</div>
                    <div class="detail-value">{{order_total}}</div>
                </div>
            </div>
        </div>

        <!-- Botón de acción -->
        <div style="text-align: center;">
            <a href="http://localhost:5173/seguimiento" class="button">
                Ver Seguimiento del Pedido
            </a>
        </div>

        <!-- Información adicional -->
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #666;">
                <strong>¿Necesitas ayuda?</strong><br>
                Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Este es un mensaje automático de {{company_name}}</p>
            <p>No respondas a este email. Para consultas, contacta nuestro servicio al cliente.</p>
        </div>
    </div>
</body>
</html>
```

### Variables del Template:

- `{{to_name}}` - Nombre del cliente
- `{{to_email}}` - Email del cliente  
- `{{order_id}}` - ID del pedido
- `{{order_status}}` - Estado actual del pedido
- `{{order_date}}` - Fecha del pedido
- `{{order_total}}` - Total del pedido
- `{{company_name}}` - Nombre de la empresa
- `{{message}}` - Mensaje personalizado

### Instrucciones para EmailJS:

1. **Ve a EmailJS.com** → Templates
2. **Selecciona** "Order Status Notification"
3. **Haz clic en "Edit"** (ícono de lápiz)
4. **Copia y pega** el HTML de arriba
5. **Guarda** el template
6. **Prueba** el template con datos de ejemplo

### 🧪 Para Probar:

1. **Ve a la tienda** y haz login
2. **Haz clic en tu nombre** → "📧 Test Emails"
3. **Cambia el estado** del pedido #40
4. **Revisa el email** - ahora debería usar el template correcto

¡El sistema ahora enviará emails con el template "Order Status Notification" correcto! 🎉
