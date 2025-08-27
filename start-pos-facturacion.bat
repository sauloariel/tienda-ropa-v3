@echo off
echo ========================================
echo    🏪 SISTEMA POS CON FACTURACION
echo ========================================
echo.

echo 🔧 Iniciando Backend...
cd backend_definitivo
start "Backend - Sistema POS" cmd /k "npm run dev"

echo ⏳ Esperando que el backend se inicie...
timeout /t 5 /nobreak >nul

echo 🌐 Iniciando Frontend POS...
cd ..\tienda-ropa
start "Frontend - Sistema POS" cmd /k "npm run dev"

echo ⏳ Esperando que el frontend se inicie...
timeout /t 8 /nobreak >nul

echo 🌍 Abriendo navegador...
start http://localhost:5173

echo.
echo ========================================
echo ✅ Sistema POS con Facturación iniciado
echo ========================================
echo.
echo 📱 Frontend: http://localhost:5173
echo 🔌 Backend:  http://localhost:4000
echo.
echo 💡 Para usar la facturación:
echo    1. Agrega productos al carrito
echo    2. Presiona "Finalizar Venta"
echo    3. Selecciona método de pago
echo    4. Se generará la factura automáticamente
echo.
echo 🎯 Presiona cualquier tecla para cerrar...
pause >nul
