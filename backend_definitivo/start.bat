@echo off
echo ========================================
echo    Iniciando Backend de Tienda de Ropa
echo ========================================
echo.
echo Inicializando base de datos...
npm run init-db
echo.
echo Iniciando servidor en puerto 4000...
npm run dev
pause
