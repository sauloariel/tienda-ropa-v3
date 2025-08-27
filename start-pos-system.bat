@echo off
echo ========================================
echo    🏪 SISTEMA POS - SUPERMERCADO
echo ========================================
echo.
echo Iniciando sistema completo...
echo.

echo [1/3] Iniciando Backend...
cd backend_definitivo
start "Backend - Sistema POS" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

echo [2/3] Iniciando Frontend...
cd ../tienda-ropa
start "Frontend - Sistema POS" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

echo [3/3] Abriendo navegador...
timeout /t 2 /nobreak >nul
start http://localhost:5173

echo.
echo ✅ Sistema iniciado correctamente!
echo.
echo 🌐 Frontend: http://localhost:5173
echo 🔧 Backend: http://localhost:4000
echo.
echo 💡 Para usar el sistema POS:
echo    1. Navega a la aplicación
echo    2. Haz clic en "💰 Sistema POS"
echo    3. ¡Comienza a vender!
echo.
echo Presiona cualquier tecla para cerrar...
pause >nul

