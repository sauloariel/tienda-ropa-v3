import { useAuth } from '../contexts/NewAuthContext';

export default function RoleGuard({
  allow,
  children,
  ruta,
}: { 
  allow: string[]; 
  children: React.ReactNode; 
  ruta?: string;
}) {
  const { user, canAccess } = useAuth();

  console.log('🔍 RoleGuard - Usuario:', user);
  console.log('🔍 RoleGuard - Roles permitidos:', allow);
  console.log('🔍 RoleGuard - Rol del usuario:', user?.rol);
  console.log('🔍 RoleGuard - Incluye rol?', user?.rol ? allow.includes(user.rol) : false);
  console.log('🔍 RoleGuard - Ruta:', ruta);

  if (!user) {
    console.log('❌ RoleGuard - No hay usuario');
    return null;
  }

  // Verificar si el usuario tiene el rol permitido
  const hasRole = allow.includes(user.rol);
  console.log('🔍 RoleGuard - Has role?', hasRole);

  // Verificar acceso al módulo si se proporciona ruta
  const hasModuleAccess = ruta ? canAccess(ruta) : true;
  console.log('🔍 RoleGuard - Can access module?', hasModuleAccess);

  if (!hasRole || !hasModuleAccess) {
    console.log('❌ RoleGuard - Acceso denegado');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600 mb-4">
            No tienes permisos para acceder a este módulo.
          </p>
          <p className="text-sm text-gray-500">
            Tu rol: <span className="font-semibold">{user.rol}</span>
          </p>
        </div>
      </div>
    );
  }

  console.log('✅ RoleGuard - Acceso permitido');
  return <>{children}</>;
}


















