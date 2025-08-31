import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export function RequireRole({ roles, children }: { roles: string[]; children: JSX.Element }) {
  const { hasRole } = useAuth();
  return hasRole(...roles) ? children : <Navigate to="/" replace />;
}
