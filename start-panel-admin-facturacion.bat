@echo off
echo ========================================
echo    🏪 PANEL ADMINISTRATIVO CON FACTURACION
echo ========================================
echo.

echo 🎨 Panel administrativo con facturación integrada:
echo    ✅ POS con facturación automática
echo    ✅ Modal de factura profesional
echo    ✅ Cálculo automático de IVA
echo    ✅ Múltiples métodos de pago
echo    ✅ Integración con backend
echo.

echo 🔧 Iniciando Backend...
cd backend_definitivo
start "Backend - Panel Admin" cmd /k "npm run dev"

echo ⏳ Esperando que el backend se inicie...
timeout /t 5 /nobreak >nul

echo 🌐 Iniciando Panel Administrativo...
cd ..\panel-administrativo
start "Panel Administrativo - Facturación" cmd /k "npm run dev"

echo ⏳ Esperando que el panel se inicie...
timeout /t 8 /nobreak >nul

echo 🌍 Abriendo navegador...
start http://localhost:5173

echo.
echo ========================================
echo ✅ Panel Administrativo con Facturación iniciado
echo ========================================
echo.
echo 📱 Panel Admin: http://localhost:5173
echo 🔌 Backend:     http://localhost:4000
echo.
echo 🎯 Nuevas características del POS:
echo    • Facturación automática integrada
echo    • Cálculo automático de IVA (21%)
echo    • Modal de factura profesional
echo    • Múltiples métodos de pago
echo    • Integración completa con backend
echo.
echo 💡 Para usar la facturación:
echo    1. Ve a la página "POS" en el panel
echo    2. Agrega productos al carrito
echo    3. Presiona "Finalizar Venta y Facturar"
echo    4. Se generará la factura automáticamente
echo.
echo 🎯 Presiona cualquier tecla para cerrar...
pause >nul





