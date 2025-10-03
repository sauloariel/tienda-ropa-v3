import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { clientAuthService } from '../services/clientAuth';
import type { Cliente } from '../types/cliente.types';
import { sendUserVerificationEmail } from '../services/emailVerificationService';

interface ClientAuthContextType {
  cliente: Cliente | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (mail: string, password: string) => Promise<boolean>;
  register: (clienteData: any) => Promise<{ success: boolean; cliente?: Cliente; needsVerification?: boolean }>;
  logout: () => void;
  verifyEmailToken: (token: string) => Promise<{ success: boolean; message: string; cliente?: Cliente }>;
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
    // Verificar si hay usuario guardado en localStorage
    const savedClientEmail = localStorage.getItem('clientEmail');
    if (savedClientEmail) {
      // Aquí podrías hacer una verificación adicional con el backend
      // Por ahora, solo establecer como no autenticado hasta que haga login
      console.log('ℹ️ Email guardado encontrado, pero requiere login');
    }
    
    setIsLoading(false);
    console.log('ℹ️ Sistema de autenticación inicializado');
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

  const register = async (clienteData: any): Promise<{ success: boolean; cliente?: Cliente; needsVerification?: boolean }> => {
    try {
      setError(null);
      setIsLoading(true);
      
      console.log('🔄 Registrando nuevo usuario...');
      const result = await clientAuthService.register(clienteData);
      
      if (result.success && result.cliente) {
        console.log('✅ Usuario registrado exitosamente:', result.cliente);
        
        // Generar token de verificación (simulado)
        const verificationToken = generateVerificationToken();
        
        // Enviar email de verificación
        console.log('📧 Enviando email de verificación...');
        const emailSent = await sendUserVerificationEmail(
          clienteData.mail,
          `${clienteData.nombre} ${clienteData.apellido}`,
          verificationToken
        );
        
        if (emailSent) {
          console.log('✅ Email de verificación enviado');
          
          // Guardar datos del usuario para la verificación
          localStorage.setItem('pendingVerificationEmail', clienteData.mail);
          localStorage.setItem('pendingVerificationName', `${clienteData.nombre} ${clienteData.apellido}`);
          localStorage.setItem('pendingVerificationToken', verificationToken);
          
          // No establecer el cliente como autenticado hasta que verifique su email
          return { 
            success: true, 
            cliente: result.cliente, 
            needsVerification: true 
          };
        } else {
          console.log('⚠️ Usuario registrado pero email de verificación no enviado');
          // Aún así permitir el registro
          setCliente(result.cliente);
          localStorage.setItem('clientEmail', clienteData.mail);
          return { success: true, cliente: result.cliente };
        }
      }
      
      setError(result.message || 'Error al registrarse');
      return { success: false };
    } catch (error: any) {
      console.error('❌ Error en registro:', error);
      setError(error.message || 'Error al registrarse');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  // Función para generar token de verificación (simulado)
  const generateVerificationToken = (): string => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const verifyEmailToken = async (token: string): Promise<{ success: boolean; message: string; cliente?: Cliente }> => {
    try {
      console.log('🔍 Verificando token de email:', token);
      
      // Aquí harías la llamada al backend para verificar el token
      // const response = await clientAuthService.verifyEmailToken(token);
      
      // Simular verificación exitosa por ahora
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar que el token coincida con el almacenado
      const storedToken = localStorage.getItem('pendingVerificationToken');
      const emailFromStorage = localStorage.getItem('pendingVerificationEmail');
      const nameFromStorage = localStorage.getItem('pendingVerificationName');
      
      if (!storedToken || storedToken !== token) {
        throw new Error('Token de verificación inválido o expirado');
      }
      
      if (!emailFromStorage || !nameFromStorage) {
        throw new Error('No se encontraron datos de verificación');
      }
      
      const mockCliente: Cliente = {
        id: 1,
        nombre: nameFromStorage.split(' ')[0] || 'Usuario',
        apellido: nameFromStorage.split(' ')[1] || 'Verificado',
        mail: emailFromStorage,
        telefono: '3764743438',
        direccion: 'Dirección de ejemplo',
        // Agregar otros campos según tu tipo Cliente
      } as Cliente;
      
      console.log('✅ Token de email verificado exitosamente');
      console.log('👤 Usuario verificado:', mockCliente);
      
      // Establecer el cliente como autenticado
      setCliente(mockCliente);
      localStorage.setItem('clientEmail', mockCliente.mail);
      
      // Limpiar datos temporales
      localStorage.removeItem('pendingVerificationEmail');
      localStorage.removeItem('pendingVerificationName');
      localStorage.removeItem('pendingVerificationToken');
      
      return {
        success: true,
        message: 'Email verificado exitosamente',
        cliente: mockCliente
      };
      
    } catch (error: any) {
      console.error('❌ Error verificando token de email:', error);
      return {
        success: false,
        message: error.message || 'Error al verificar el token de email'
      };
    }
  };

  const logout = async () => {
    try {
      setCliente(null);
      localStorage.removeItem('clientEmail');
      clientAuthService.logout();
      console.log('✅ Logout exitoso');
    } catch (error) {
      console.error('Error en logout:', error);
      // Forzar logout local
      setCliente(null);
      localStorage.removeItem('clientEmail');
    }
  };

  const value: ClientAuthContextType = {
    cliente,
    isAuthenticated: !!cliente,
    isLoading,
    login,
    register,
    logout,
    verifyEmailToken,
    error
  };

  return (
    <ClientAuthContext.Provider value={value}>
      {children}
    </ClientAuthContext.Provider>
  );
};