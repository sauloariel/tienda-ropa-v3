@echo off
echo ========================================
echo    Iniciando Tienda de Ropa Completa
echo ========================================
echo.
echo Este script iniciara tanto el backend como el frontend
echo.
echo 1. Iniciando Backend en puerto 4000...
echo.
cd backend_definitivo
start "Backend - Tienda de Ropa" cmd /k "npm run dev"
echo.
echo 2. Esperando 5 segundos para que el backend se inicie...
timeout /t 5 /nobreak > nul
echo.
echo 3. Iniciando Frontend en puerto 5173...
echo.
cd ..\tienda-ropa
start "Frontend - Tienda de Ropa" cmd /k "npm run dev"
echo.
echo ========================================
echo    Ambos servicios estan iniciando
echo ========================================
echo.
echo Backend: http://localhost:4000
echo Frontend: http://localhost:5173
echo.
echo Presiona cualquier tecla para cerrar este script...
pause > nul
