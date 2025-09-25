import { useAuth } from '../contexts/NewAuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  console.log('🔍 ProtectedRoute - isLoading:', isLoading);
  console.log('🔍 ProtectedRoute - user:', user);
  console.log('🔍 ProtectedRoute - user exists?', !!user);

  if (isLoading) {
    console.log('⏳ ProtectedRoute - Cargando...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('❌ ProtectedRoute - No hay usuario, redirigiendo al login');
    window.location.href = '/login';
    return null;
  }

  console.log('✅ ProtectedRoute - Usuario autenticado, permitiendo acceso');
  return <>{children}</>;
}









