@echo off
echo ========================================
echo    CARGA DEL MODULO DE PROMOCIONES
echo ========================================
echo.

echo [1/3] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado o no está en el PATH
    echo Por favor instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js encontrado

echo.
echo [2/3] Cargando tabla promociones...
cd /d "%~dp0"
node scripts/load-promociones-data.js

echo.
echo [3/3] Ejecutando pruebas...
node scripts/test-promociones.mjs

echo.
echo ========================================
echo    CARGA COMPLETADA
echo ========================================
echo.
echo El módulo de promociones está listo para usar.
echo Puedes acceder a través del panel administrativo.
echo.
pause

