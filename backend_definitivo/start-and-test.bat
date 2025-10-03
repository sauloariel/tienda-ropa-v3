@echo off
echo Iniciando servidor y ejecutando pruebas...
echo.

REM Iniciar servidor en segundo plano
start /B npm run dev

REM Esperar 5 segundos para que el servidor se inicie
timeout /t 5 /nobreak > nul

REM Ejecutar pruebas
echo Ejecutando pruebas...
node debug-detailed.mjs

REM Mantener la ventana abierta
pause

























