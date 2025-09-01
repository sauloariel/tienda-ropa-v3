import { createContext, useContext, useEffect, useState } from 'react';
import { authApi, User } from '../services/auth';
import { useNavigate } from 'react-router-dom';

type Ctx = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (usuario: string, password: string) => Promise<void>;
  logout: () => void;
  canAccess: (modulePath: string) => boolean;
};

const AuthContext = createContext<Ctx | null>(null);

export const PERMISOS_POR_ROL: Record<User['rol'], { id:string; nombre:string; ruta:string }[]> = {
  Admin: [
    { id:'pos', ruta:'/pos', nombre:'POS' },
    { id:'productos', ruta:'/productos', nombre:'Productos' },
    { id:'pedidos', ruta:'/pedidos', nombre:'Pedidos' },
    { id:'clientes', ruta:'/clientes', nombre:'Clientes' },
    { id:'empleados', ruta:'/empleados', nombre:'Empleados' },
    { id:'ventas', ruta:'/ventas', nombre:'Ventas' },
    { id:'estadisticas', ruta:'/estadisticas', nombre:'Estadísticas' },
    { id:'marketing', ruta:'/marketing', nombre:'Marketing' },
  ],
  Vendedor: [
    { id:'pos', ruta:'/pos', nombre:'POS' },
    { id:'pedidos', ruta:'/pedidos', nombre:'Pedidos' },
    { id:'clientes', ruta:'/clientes', nombre:'Clientes' },
    { id:'ventas', ruta:'/ventas', nombre:'Ventas' },
  ],
  Inventario: [
    { id:'productos', ruta:'/productos', nombre:'Productos' },
    { id:'pedidos', ruta:'/pedidos', nombre:'Pedidos' },
    { id:'estadisticas', ruta:'/estadisticas', nombre:'Estadísticas' },
  ],
  Marketing: [
    { id:'marketing', ruta:'/marketing', nombre:'Marketing' },
    { id:'estadisticas', ruta:'/estadisticas', nombre:'Estadísticas' },
  ],
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]   = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

  const login = async (usuario: string, password: string) => {
    console.log('🔐 Intentando login con:', usuario);
    const resp = await authApi.login(usuario, password);
    console.log('🔐 Respuesta del login:', resp);
    if (!resp.success) throw new Error('Credenciales inválidas');
    setToken(resp.token);
    setUser(resp.user);
    localStorage.setItem('authToken', resp.token);
    localStorage.setItem('authUser', JSON.stringify(resp.user));
    console.log('✅ Login exitoso, token guardado:', resp.token.substring(0, 20) + '...');
    navigate('/dashboard');
  };

  const logout = () => {
    setUser(null); setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    navigate('/login');
  };

  const canAccess = (modulePath: string) => {
    if (!user) return false;
    return PERMISOS_POR_ROL[user.rol].some(p => p.ruta === modulePath || p.id === modulePath);
    // permite both: canAccess('/pos') o canAccess('pos')
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, canAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider/>');
  return ctx;
};