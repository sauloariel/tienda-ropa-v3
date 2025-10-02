# Test directo del sistema de notificaciones de pedidos
Write-Host "🧪 Test del Sistema de Notificaciones de Pedidos" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host ""

try {
    # 1. Verificar backend
    Write-Host "1️⃣ Verificando backend..." -ForegroundColor Yellow
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:4000/api/health" -Method GET
    Write-Host "✅ Backend funcionando: $($healthResponse.ok)" -ForegroundColor Green

    # 2. Obtener pedido #40
    Write-Host "`n2️⃣ Obteniendo pedido #40..." -ForegroundColor Yellow
    $pedidoResponse = Invoke-RestMethod -Uri "http://localhost:4000/api/pedidos/40" -Method GET
    $pedido = $pedidoResponse
    
    Write-Host "✅ Pedido encontrado:" -ForegroundColor Green
    Write-Host "   ID: $($pedido.id_pedido)" -ForegroundColor White
    Write-Host "   Cliente: $($pedido.cliente.nombre) $($pedido.cliente.apellido)" -ForegroundColor White
    Write-Host "   Email: $($pedido.cliente.mail)" -ForegroundColor White
    Write-Host "   Estado actual: $($pedido.estado)" -ForegroundColor White
    Write-Host "   Importe: `$$($pedido.importe)" -ForegroundColor White

    # 3. Test directo de EmailJS
    Write-Host "`n3️⃣ Test directo de EmailJS..." -ForegroundColor Yellow
    
    $emailjsUrl = "https://api.emailjs.com/api/v1.0/email/send"
    $emailjsData = @{
        service_id = "service_qxnyfzk"
        template_id = "template_zmw434n"
        user_id = "CIEawmID0xf-Hl2L1"
        template_params = @{
            to_email = $pedido.cliente.mail
            to_name = "$($pedido.cliente.nombre) $($pedido.cliente.apellido)"
            order_id = $pedido.id_pedido.ToString()
            order_status = "Test"
            order_date = (Get-Date $pedido.fecha_pedido).ToString("dd/MM/yyyy")
            order_total = "`$$($pedido.importe)"
            company_name = "Tu Tienda Online"
            from_name = "Equipo de Pedidos"
            from_email = "noreply@tienda.com"
            message = "Test de notificación para pedido #$($pedido.id_pedido)"
            reply_to = "noreply@tienda.com"
        }
    } | ConvertTo-Json -Depth 3

    Write-Host "📧 Enviando email de prueba..." -ForegroundColor Cyan
    $emailResponse = Invoke-RestMethod -Uri $emailjsUrl -Method POST -Body $emailjsData -ContentType "application/json"
    
    Write-Host "✅ Email enviado exitosamente" -ForegroundColor Green
    Write-Host "📧 Revisa el email: $($pedido.cliente.mail)" -ForegroundColor Cyan

    # 4. Test del endpoint de cambio de estado
    Write-Host "`n4️⃣ Test del endpoint de cambio de estado..." -ForegroundColor Yellow
    
    $estadoAnterior = $pedido.estado
    $nuevoEstado = if ($estadoAnterior -eq "pendiente") { "procesando" } else { "pendiente" }
    
    Write-Host "🔄 Cambiando estado de '$estadoAnterior' a '$nuevoEstado'..." -ForegroundColor Cyan
    
    $updateBody = @{ estado = $nuevoEstado } | ConvertTo-Json
    $updateResponse = Invoke-RestMethod -Uri "http://localhost:4000/api/pedidos/$($pedido.id_pedido)/estado" -Method PUT -Body $updateBody -ContentType "application/json"
    
    Write-Host "✅ Estado actualizado: $($updateResponse.message)" -ForegroundColor Green
    Write-Host "📧 Email enviado: $(if ($updateResponse.email_enviado) { 'SÍ' } else { 'NO' })" -ForegroundColor $(if ($updateResponse.email_enviado) { 'Green' } else { 'Yellow' })

    if ($updateResponse.email_enviado) {
        Write-Host "`n🎉 ¡Sistema funcionando correctamente!" -ForegroundColor Green
        Write-Host "📧 Revisa el email del cliente para ver la notificación" -ForegroundColor Cyan
    } else {
        Write-Host "`n⚠️ Email no enviado. Revisando configuración..." -ForegroundColor Yellow
    }

} catch {
    Write-Host "❌ Error en el test: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Detalles: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}
