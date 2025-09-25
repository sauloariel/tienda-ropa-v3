import { createContext, useContext, useEffect, useState } from 'react';
import { authApi, User } from '../services/auth';
import { useNavigate } from 'react-router-dom';

type AuthCtx = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (usuario: string, password: string) => Promise<void>;
  logout: () => void;
  canAccess: (modulePath: string) => boolean;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔄 AuthContext useEffect iniciado');
    const t = localStorage.getItem('authToken');
    const u = localStorage.getItem('authUser');
    if (t && u) {
      setToken(t);
      try { 
        const userData = JSON.parse(u);
        setUser(userData);
        console.log('🔍 Token encontrado:', t.substring(0, 20) + '...');
        console.log('🔍 Usuario encontrado:', userData);
      } catch (e) {
        console.error('❌ Error parseando usuario:', e);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    } else {
      console.log('🔍 No hay token guardado');
    }
    setIsLoading(false);
    console.log('✅ AuthContext useEffect completado');
  }, []);

  const login = async (usuario: string, password: string) => {
    console.log('🔐 Intentando login con:', usuario);
    const resp = await authApi.login(usuario, password);
    console.log('🔐 Respuesta del login:', resp);
    if (!resp.token || !resp.user) throw new Error('Credenciales inválidas');
    setToken(resp.token);
    setUser(resp.user);
    localStorage.setItem('authToken', resp.token);
    localStorage.setItem('authUser', JSON.stringify(resp.user));
    console.log('✅ Login exitoso, token guardado:', resp.token.substring(0, 20) + '...');
    console.log('✅ Usuario guardado:', resp.user);
    navigate('/');
  };

  const logout = () => {
    setUser(null); 
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    navigate('/login');
  };

  const canAccess = (modulePath: string) => {
    if (!user) {
      console.log('🔍 canAccess - No hay usuario');
      return false;
    }
    
    // Sistema de permisos simplificado basado en roles
    const rolePermissions: { [key: string]: string[] } = {
      'Admin': ['/pos', '/productos', '/pedidos', '/clientes', '/empleados', '/ventas', '/estadisticas', '/marketing'],
      'Vendedor': ['/pos', '/productos', '/pedidos', '/clientes', '/ventas'],
      'Inventario': ['/productos', '/pedidos'],
      'Marketing': ['/marketing', '/estadisticas']
    };
    
    const userRole = user.rol;
    const permissions = rolePermissions[userRole] || [];
    
    console.log('🔍 canAccess - Rol del usuario:', userRole);
    console.log('🔍 canAccess - Permisos disponibles:', permissions);
    console.log('🔍 canAccess - Módulo solicitado:', modulePath);
    
    const tieneAcceso = permissions.some(p => p === modulePath || p === modulePath.replace('/', ''));
    console.log('🔍 canAccess - Tiene acceso?', tieneAcceso);
    
    return tieneAcceso;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isLoading, 
      isAuthenticated: !!user,
      login, 
      logout,
      canAccess
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};









