import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  // Debug logs
  console.log('🔍 ProtectedRoute - isLoading:', isLoading);
  console.log('🔍 ProtectedRoute - user:', user);
  console.log('🔍 ProtectedRoute - user exists?', !!user);
  
  if (isLoading) {
    console.log('⏳ ProtectedRoute - Cargando...');
    return <div className="p-8 text-center">Cargando…</div>;
  }
  if (!user) {
    console.log('❌ ProtectedRoute - No hay usuario, redirigiendo a login');
    return <Navigate to="/login" replace />;
  }
  
  console.log('✅ ProtectedRoute - Usuario autenticado, permitiendo acceso');
  return <>{children}</>;
}
