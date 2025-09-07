@echo off
echo ========================================
echo  TEST ULTRA SIMPLE - MODULO DE VENTAS
echo ========================================
echo.

echo Verificando si Node.js esta instalado...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no esta instalado
    echo 💡 Instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
echo.

echo 🚀 Ejecutando test ultra simple...
echo    (No requiere dependencias externas)
echo.

node test-ventas-ultra-simple.js

echo.
echo ========================================
echo    TEST COMPLETADO
echo ========================================
pause


