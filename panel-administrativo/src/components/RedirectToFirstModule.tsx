import { Navigate } from 'react-router-dom';
import { useSimpleAuth } from '../contexts/SimpleAuthContext';

export default function RedirectToFirstModule() {
  const { user } = useSimpleAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Definir el primer módulo permitido para cada rol
  const roleFirstModule: { [key: string]: string } = {
    'Admin': '/pos',           // Admin puede acceder a todo, empezamos con POS
    'Vendedor': '/pos',        // Vendedor empieza con POS
    'Inventario': '/productos', // Inventario empieza con productos
    'Marketing': '/marketing'   // Marketing empieza con marketing
  };
  
  const firstModule = roleFirstModule[user.rol];
  
  if (!firstModule) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <Navigate to={firstModule} replace />;
}

