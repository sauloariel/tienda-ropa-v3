# Template de EmailJS para Notificaciones de Pedidos

## Configuración en EmailJS Dashboard

1. **Ve a**: https://www.emailjs.com/
2. **Inicia sesión** en tu cuenta
3. **Ve a Templates** → **Create New Template**
4. **Nombre del template**: `Order Status Notification`
5. **Template ID**: `template_order_status` (o el que prefieras)

## HTML del Template

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Actualización de Pedido</title>
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
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .order-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #667eea;
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
        .status-anulado { background-color: #f8d7da; color: #721c24; }
        .status-pendiente { background-color: #e2e3e5; color: #383d41; }
        
        .order-details {
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .detail-label {
            font-weight: bold;
            color: #666;
        }
        .detail-value {
            color: #333;
        }
        .message-box {
            background-color: #e7f3ff;
            border: 1px solid #b3d9ff;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .message-box h3 {
            margin-top: 0;
            color: #0066cc;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
        }
        .contact-info {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background-color: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 10px 0;
        }
        .btn:hover {
            background-color: #5a6fd8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📦 Actualización de Pedido</h1>
            <p>{{company_name}}</p>
        </div>

        <h2>¡Hola {{to_name}}!</h2>
        
        <div class="message-box">
            <h3>📢 {{message}}</h3>
        </div>

        <div class="order-info">
            <h3>📋 Detalles del Pedido</h3>
            <div class="order-details">
                <div class="detail-row">
                    <span class="detail-label">Número de Pedido:</span>
                    <span class="detail-value">#{{order_id}}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Estado Actual:</span>
                    <span class="detail-value">
                        <span class="status-badge status-{{order_status}}">{{order_status}}</span>
                    </span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Fecha del Pedido:</span>
                    <span class="detail-value">{{order_date}}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Total:</span>
                    <span class="detail-value">{{order_total}}</span>
                </div>
            </div>
        </div>

        <div class="contact-info">
            <h3>📞 ¿Necesitas Ayuda?</h3>
            <p>Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos:</p>
            <p><strong>Email:</strong> {{reply_to}}</p>
            <p><strong>Horario de Atención:</strong> Lunes a Viernes de 9:00 a 18:00</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
            <a href="#" class="btn">Ver Mis Pedidos</a>
        </div>

        <div class="footer">
            <p>Este es un email automático, por favor no respondas directamente.</p>
            <p>© 2025 {{company_name}}. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
```

## Variables del Template

El template utiliza las siguientes variables que se envían desde el backend:

- `{{to_email}}` - Email del destinatario
- `{{to_name}}` - Nombre del cliente
- `{{order_id}}` - ID del pedido
- `{{order_status}}` - Estado actual del pedido
- `{{order_date}}` - Fecha del pedido
- `{{order_total}}` - Total del pedido
- `{{company_name}}` - Nombre de la empresa
- `{{from_name}}` - Nombre del remitente
- `{{from_email}}` - Email del remitente
- `{{message}}` - Mensaje personalizado
- `{{reply_to}}` - Email de respuesta

## Configuración del Servicio

1. **Service ID**: `service_qxnyfzk` (el mismo que ya tienes)
2. **Template ID**: `template_order_status` (nuevo template)
3. **Public Key**: `CIEawmID0xf-Hl2L1` (el mismo que ya tienes)

## Próximos Pasos

1. Crear el template en EmailJS con el HTML de arriba
2. Actualizar el `orderEmailService.ts` con el nuevo Template ID
3. Probar el sistema cambiando el estado de un pedido
