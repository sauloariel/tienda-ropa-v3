import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { clientAuthService } from '../services/clientAuth';
import type { Cliente } from '../types/cliente.types';

interface ClientAuthContextType {
  cliente: Cliente | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (mail: string, password: string) => Promise<boolean>;
  register: (clienteData: any) => Promise<boolean>;
  logout: () => void;
  error: string | null;
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined);

export const useClientAuth = () => {
  const context = useContext(ClientAuthContext);
  if (context === undefined) {
    throw new Error('useClientAuth must be used within a ClientAuthProvider');
  }
  return context;
};

interface ClientAuthProviderProps {
  children: ReactNode;
}

export const ClientAuthProvider: React.FC<ClientAuthProviderProps> = ({ children }) => {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar si hay un cliente guardado al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      // Limpiar cualquier cliente guardado para forzar login explícito
      localStorage.removeItem('clientEmail');
      setCliente(null);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (mail: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);
      
      const result = await clientAuthService.login(mail, password);
      
      if (result.success && result.cliente) {
        setCliente(result.cliente);
        localStorage.setItem('clientEmail', mail);
        return true;
      } else {
        setError(result.message || 'Error al iniciar sesión');
        return false;
      }
    } catch (error: any) {
      setError(error.message || 'Error al iniciar sesión');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (clienteData: any): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);
      
      const result = await clientAuthService.register(clienteData);
      
      if (result.success && result.cliente) {
        setCliente(result.cliente);
        localStorage.setItem('clientEmail', clienteData.mail);
        return true;
      } else {
        setError(result.message || 'Error al registrarse');
        return false;
      }
    } catch (error: any) {
      setError(error.message || 'Error al registrarse');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCliente(null);
    localStorage.removeItem('clientEmail');
    clientAuthService.logout();
  };

  const value: ClientAuthContextType = {
    cliente,
    isAuthenticated: !!cliente,
    isLoading,
    login,
    register,
    logout,
    error
  };

  return (
    <ClientAuthContext.Provider value={value}>
      {children}
    </ClientAuthContext.Provider>
  );
};