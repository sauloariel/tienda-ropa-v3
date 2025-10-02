# Script PowerShell para probar notificaciones de pedidos
Write-Host "🧪 Probando sistema de notificaciones de pedidos..." -ForegroundColor Cyan
Write-Host ""

try {
    # 1. Obtener lista de pedidos
    Write-Host "1️⃣ Obteniendo lista de pedidos..." -ForegroundColor Yellow
    $pedidosResponse = Invoke-RestMethod -Uri "http://localhost:4000/api/pedidos" -Method GET
    $pedidos = $pedidosResponse
    
    if (-not $pedidos -or $pedidos.Count -eq 0) {
        Write-Host "❌ No hay pedidos para probar" -ForegroundColor Red
        exit
    }

    $primerPedido = $pedidos[0]
    Write-Host "✅ Pedido encontrado: #$($primerPedido.id_pedido)" -ForegroundColor Green
    Write-Host "   Cliente: $($primerPedido.cliente.nombre)" -ForegroundColor White
    Write-Host "   Estado actual: $($primerPedido.estado)" -ForegroundColor White
    Write-Host "   Email: $($primerPedido.cliente.mail)" -ForegroundColor White
    Write-Host ""

    # 2. Cambiar estado del pedido
    $estados = @('procesando', 'completado', 'entregado')
    $nuevoEstado = $estados | Get-Random
    
    Write-Host "2️⃣ Cambiando estado a: $nuevoEstado" -ForegroundColor Yellow
    
    $body = @{
        estado = $nuevoEstado
    } | ConvertTo-Json

    $updateResponse = Invoke-RestMethod -Uri "http://localhost:4000/api/pedidos/$($primerPedido.id_pedido)/estado" -Method PUT -Body $body -ContentType "application/json"

    Write-Host "✅ Estado actualizado: $($updateResponse.message)" -ForegroundColor Green
    Write-Host "📧 Email enviado: $(if ($updateResponse.email_enviado) { 'SÍ' } else { 'NO' })" -ForegroundColor $(if ($updateResponse.email_enviado) { 'Green' } else { 'Yellow' })

    # 3. Verificar respuesta
    if ($updateResponse.email_enviado) {
        Write-Host ""
        Write-Host "🎉 ¡Notificación enviada exitosamente!" -ForegroundColor Green
        Write-Host "📧 Revisa el email del cliente para ver la notificación" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "⚠️ Email no enviado. Verifica la configuración de EmailJS" -ForegroundColor Yellow
    }

} catch {
    Write-Host "❌ Error en la prueba: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Detalles: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}