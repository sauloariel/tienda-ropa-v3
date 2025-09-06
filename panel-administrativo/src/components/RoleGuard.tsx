import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../services/auth';

export default function RoleGuard({
  allow,
  children,
  ruta,
}: { allow: User['rol'][]; children: React.ReactNode; ruta?: string }) {
  const { user, canAccess } = useAuth();
  
  // Debug logs
  console.log('🔍 RoleGuard - Usuario:', user);
  console.log('🔍 RoleGuard - Roles permitidos:', allow);
  console.log('🔍 RoleGuard - Rol del usuario:', user?.rol);
  console.log('🔍 RoleGuard - Incluye rol?', user?.rol ? allow.includes(user.rol) : false);
  console.log('🔍 RoleGuard - Ruta:', ruta);
  console.log('🔍 RoleGuard - Can access?', ruta ? canAccess(ruta) : 'N/A');
  
  if (!user) {
    console.log('❌ RoleGuard - No hay usuario, redirigiendo a login');
    return <Navigate to="/login" replace />;
  }
  if (!allow.includes(user.rol)) {
    console.log('❌ RoleGuard - Rol no permitido, redirigiendo a unauthorized');
    console.log('❌ RoleGuard - Rol recibido:', `"${user.rol}"`);
    console.log('❌ RoleGuard - Roles permitidos:', allow);
    return <Navigate to="/unauthorized" replace />;
  }
  if (ruta && !canAccess(ruta)) {
    console.log('❌ RoleGuard - Sin acceso a ruta, redirigiendo a unauthorized');
    return <Navigate to="/unauthorized" replace />;
  }
  
  console.log('✅ RoleGuard - Acceso permitido');
  return <>{children}</>;
}







