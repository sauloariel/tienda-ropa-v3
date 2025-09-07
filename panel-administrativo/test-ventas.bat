@echo off
echo ========================================
echo    TEST DEL MODULO DE VENTAS
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

echo Verificando si axios esta instalado...
node -e "require('axios')" >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Instalando axios...
    npm install axios
    if %errorlevel% neq 0 (
        echo ❌ Error instalando axios
        pause
        exit /b 1
    )
)

echo ✅ Dependencias listas
echo.

echo 🚀 Ejecutando test del modulo de ventas...
echo.

node test-ventas-simple.js

echo.
echo ========================================
echo    TEST COMPLETADO
echo ========================================
pause


