import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../services/auth';

export default function RoleGuard({
  allow,
  children,
  ruta,
}: { allow: User['rol'][]; children: React.ReactNode; ruta?: string }) {
  const { user, canAccess } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!allow.includes(user.rol)) return <Navigate to="/unauthorized" replace />;
  if (ruta && !canAccess(ruta)) return <Navigate to="/unauthorized" replace />;
  return <>{children}</>;
}







