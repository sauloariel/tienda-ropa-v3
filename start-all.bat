@echo off
echo 🚀 Iniciando todos los servicios...
echo.
echo Backend: http://localhost:4000
echo Tienda: http://localhost:5173
echo Panel: http://localhost:5174
echo.

start "Backend" cmd /k "cd backend_definitivo && npm run dev"
timeout /t 3 /nobreak >nul
start "Tienda" cmd /k "cd tienda-ropa && npm run dev"
timeout /t 3 /nobreak >nul
start "Panel" cmd /k "cd panel-administrativo && npm run dev"

echo ✅ Todos los servicios iniciados
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul
























