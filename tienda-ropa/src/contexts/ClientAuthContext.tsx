import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { clientAuthService } from '../services/clientAuth';
import type { Cliente } from '../types/cliente.types';
import { signInWithGoogle, signOutGoogle, getCurrentGoogleUser, mapGoogleUserToClient, auth } from '../services/googleAuth';
import { onAuthStateChanged } from 'firebase/auth';

interface ClientAuthContextType {
  cliente: Cliente | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (mail: string, password: string) => Promise<boolean>;
  register: (clienteData: any) => Promise<{ success: boolean; cliente?: Cliente }>;
  loginWithGoogle: () => Promise<boolean>;
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

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (googleUser) => {
      if (googleUser) {
        // Usuario autenticado con Google
        const clientData = mapGoogleUserToClient(googleUser);
        setCliente(clientData);
        localStorage.setItem('clientEmail', clientData.mail);
        console.log('✅ Usuario autenticado con Google:', clientData);
      } else {
        // Usuario no autenticado
        setCliente(null);
        localStorage.removeItem('clientEmail');
        console.log('ℹ️ Usuario no autenticado');
      }
      setIsLoading(false);
    });

    // Si Firebase no está configurado, verificar si hay usuario de Google guardado
    if (!auth) {
      const savedGoogleUser = localStorage.getItem('googleUser');
      if (savedGoogleUser) {
        try {
          const clientData = JSON.parse(savedGoogleUser);
          setCliente(clientData);
          localStorage.setItem('clientEmail', clientData.mail);
          console.log('✅ Usuario de Google restaurado desde localStorage:', clientData);
        } catch (error) {
          console.warn('⚠️ Error restaurando usuario de Google:', error);
          localStorage.removeItem('googleUser');
        }
      }
      setIsLoading(false);
      return;
    }

    return () => unsubscribe();
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

  const register = async (clienteData: any): Promise<{ success: boolean; cliente?: Cliente }> => {
    try {
      setError(null);
      setIsLoading(true);
      
      const result = await clientAuthService.register(clienteData);
      
      if (result.success && result.cliente) {
        setCliente(result.cliente);
        localStorage.setItem('clientEmail', clienteData.mail);
        return { success: true, cliente: result.cliente };
      }
      
      setError(result.message || 'Error al registrarse');
      return { success: false };
    } catch (error: any) {
      setError(error.message || 'Error al registrarse');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);
      
      const googleUser = await signInWithGoogle();
      if (googleUser) {
        const clientData = mapGoogleUserToClient(googleUser);
        
        // Intentar registrar/login automáticamente con los datos de Google
        try {
          const result = await register(clientData);
          if (result.success) {
            console.log('✅ Usuario registrado/logueado con Google exitosamente');
            return true;
          }
        } catch (registerError) {
          console.warn('⚠️ Error en registro con Google, intentando login...', registerError);
          
          // Si el registro falla, intentar login
          try {
            const loginResult = await clientAuthService.login(clientData.mail, clientData.password);
            if (loginResult.success && loginResult.cliente) {
              setCliente(loginResult.cliente);
              localStorage.setItem('clientEmail', clientData.mail);
              console.log('✅ Login con Google exitoso');
              return true;
            }
          } catch (loginError) {
            console.warn('⚠️ No se pudo hacer login automático, usando datos de Google directamente');
            // Usar datos de Google directamente - modo offline
            setCliente(clientData);
            localStorage.setItem('clientEmail', clientData.mail);
            localStorage.setItem('googleUser', JSON.stringify(clientData));
            console.log('✅ Usuario de Google establecido directamente (modo offline)');
            return true;
          }
        }
      }
      
      return false;
    } catch (error: any) {
      setError(error.message || 'Error al iniciar sesión con Google');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOutGoogle();
      setCliente(null);
      localStorage.removeItem('clientEmail');
      localStorage.removeItem('googleUser'); // Limpiar usuario de Google guardado
      clientAuthService.logout();
    } catch (error) {
      console.error('Error en logout:', error);
      // Forzar logout local
      setCliente(null);
      localStorage.removeItem('clientEmail');
      localStorage.removeItem('googleUser');
    }
  };

  const value: ClientAuthContextType = {
    cliente,
    isAuthenticated: !!cliente,
    isLoading,
    login,
    register,
    loginWithGoogle,
    logout,
    error
  };

  return (
    <ClientAuthContext.Provider value={value}>
      {children}
    </ClientAuthContext.Provider>
  );
};