@echo off
echo ========================================
echo    🔐 PANEL ADMINISTRATIVO CON AUTENTICACION
echo ========================================
echo.

echo 🎨 Panel administrativo con sistema de autenticación completo:
echo    ✅ Login con control de acceso basado en roles
echo    ✅ 4 roles: Admin, Vendedor, Inventario, Marketing
echo    ✅ Protección de rutas por permisos
echo    ✅ Navegación dinámica según rol
echo    ✅ Sistema de logout y gestión de sesión
echo    ✅ Interceptores de Axios para tokens
echo.

echo 🔧 Iniciando Backend...
cd backend_definitivo
start "Backend - Panel Admin Auth" cmd /k "npm run dev"

echo ⏳ Esperando que el backend se inicie...
timeout /t 5 /nobreak >nul

echo 🌐 Iniciando Panel Administrativo...
cd ..\panel-administrativo
start "Panel Administrativo - Autenticación" cmd /k "npm run dev"

echo ⏳ Esperando que el panel se inicie...
timeout /t 8 /nobreak >nul

echo 🌍 Abriendo navegador...
start http://localhost:5173

echo.
echo ========================================
echo ✅ Panel Administrativo con Autenticación iniciado
echo ========================================
echo.
echo 📱 Panel Admin: http://localhost:5173
echo 🔌 Backend:     http://localhost:4000
echo.
echo 🎯 Sistema de Autenticación Implementado:
echo    • Login seguro con validación de credenciales
echo    • Control de acceso basado en 4 roles específicos
echo    • Protección de rutas con RoleGuard
echo    • Navegación dinámica según permisos del usuario
echo    • Gestión de tokens JWT con interceptores Axios
echo    • Logout seguro con limpieza de sesión
echo.
echo 👥 Roles y Permisos:
echo    👑 Admin: Acceso completo a todos los módulos
echo    💰 Vendedor: POS, Pedidos, Clientes, Ventas
echo    📦 Inventario: Productos, Estadísticas
echo    🎯 Marketing: Marketing, Estadísticas
echo.
echo 💡 Para probar la autenticación:
echo    1. Ve a http://localhost:5173
echo    2. Serás redirigido al login
echo    3. Usa las cuentas de demostración disponibles
echo    4. Cada rol verá solo los módulos permitidos
echo.
echo 🎯 Presiona cualquier tecla para cerrar...
pause >nul



