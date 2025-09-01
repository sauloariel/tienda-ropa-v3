import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PERMISOS_POR_ROL } from '../types/auth.types';

export default function RedirectToFirstModule() {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Obtener el primer módulo permitido para el rol del usuario
  const permisos = PERMISOS_POR_ROL[user.rol] || [];
  const firstModule = permisos[0];
  
  if (!firstModule) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <Navigate to={firstModule.ruta} replace />;
}

