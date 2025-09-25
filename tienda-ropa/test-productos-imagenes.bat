@echo off
echo ========================================
echo    TEST PRODUCTOS E IMAGENES
echo ========================================
echo.

echo [1/2] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado o no está en el PATH
    echo Por favor instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js encontrado

echo.
echo [2/2] Verificando que el backend esté ejecutándose...
echo 💡 Asegúrate de que el backend esté corriendo en http://localhost:4000
echo.

cd /d "%~dp0"
echo 🚀 Ejecutando test de productos e imágenes...
echo.

node scripts/test-productos-imagenes.mjs

echo.
echo ========================================
echo    TEST COMPLETADO
echo ========================================
echo.
pause

