@echo off
echo ========================================
echo    🔐 PANEL ADMINISTRATIVO CON LOGUIN
echo ========================================
echo.

echo 🎨 Panel administrativo con autenticación usando LoguinController:
echo    ✅ Login con tabla loguin existente
echo    ✅ Usuario y contraseña de la base de datos
echo    ✅ Control de acceso basado en roles
echo    ✅ Protección de rutas por permisos
echo    ✅ Navegación dinámica según rol
echo    ✅ Sistema de logout y gestión de sesión
echo.

echo 🔧 Iniciando Backend...
cd backend_definitivo
start "Backend - Panel Admin Loguin" cmd /k "npm run dev"

echo ⏳ Esperando que el backend se inicie...
timeout /t 5 /nobreak >nul

echo 🌐 Iniciando Panel Administrativo...
cd ..\panel-administrativo
start "Panel Administrativo - Loguin" cmd /k "npm run dev"

echo ⏳ Esperando que el panel se inicie...
timeout /t 8 /nobreak >nul

echo 🌍 Abriendo navegador...
start http://localhost:5173

echo.
echo ========================================
echo ✅ Panel Administrativo con Loguin iniciado
echo ========================================
echo.
echo 📱 Panel Admin: http://localhost:5173
echo 🔌 Backend:     http://localhost:4000
echo.
echo 🎯 Sistema de Autenticación Implementado:
echo    • Login usando tabla loguin existente
echo    • Campo "usuario" en lugar de "email"
echo    • Control de acceso basado en roles
echo    • Protección de rutas con RoleGuard
echo    • Navegación dinámica según permisos
echo    • Gestión de tokens JWT
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
echo    3. Usa tu usuario y contraseña de la tabla loguin
echo    4. O usa las cuentas de demostración disponibles
echo    5. Cada rol verá solo los módulos permitidos
echo.
echo 🔐 Endpoints de Autenticación:
echo    • POST /api/login/auth/login - Login
echo    • GET  /api/login/auth/verify - Verificar token
echo    • POST /api/login/auth/logout - Logout
echo    • GET  /api/login/auth/me - Usuario actual
echo    • PUT  /api/login/auth/change-password - Cambiar contraseña
echo.
echo 🎯 Presiona cualquier tecla para cerrar...
pause >nul





