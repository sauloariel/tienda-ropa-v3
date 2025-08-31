import { createContext, useContext, useEffect, useState } from 'react';

type User = { 
  id: number; 
  nombre: string; 
  rol: 'Administrador' | 'Vendedor' | 'Inventario' | 'Marketing';
  usuario: string;
  email: string;
  activo: boolean;
  empleado_id: number;
  rol_id: number;
};

type AuthCtx = { 
  user: User | null; 
  token: string | null; 
  login: (e: string, p: string) => Promise<void>; 
  logout: () => void; 
  hasRole: (...r: string[]) => boolean; 
};

const Ctx = createContext<AuthCtx>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if (t && u) { 
      setToken(t); 
      setUser(JSON.parse(u)); 
    }
  }, []);

  async function doLogin(email: string, password: string) {
    const { token, user } = await (await import('../services/authService')).login(email, password);
    setToken(token); 
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  function logout() { 
    setToken(null); 
    setUser(null); 
    localStorage.clear(); 
  }

  function hasRole(...roles: string[]) { 
    return !!user && roles.includes(user.rol); 
  }

  return <Ctx.Provider value={{ user, token, login: doLogin, logout, hasRole }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);