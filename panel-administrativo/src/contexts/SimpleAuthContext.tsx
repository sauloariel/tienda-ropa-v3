import React, { createContext, useContext, useEffect, useState } from 'react';
import { simpleAuthService, SimpleUser } from '../services/simpleAuth';

interface SimpleAuthContextType {
    user: SimpleUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (usuario: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
    hasRole: (role: string) => boolean;
    hasAnyRole: (roles: string[]) => boolean;
}

const SimpleAuthContext = createContext<SimpleAuthContextType | null>(null);

export const SimpleAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<SimpleUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Verificar si hay un usuario almacenado al cargar la aplicación
        const storedUser = simpleAuthService.getCurrentUser();
        if (storedUser) {
            setUser(storedUser);
        }
        setIsLoading(false);
    }, []);

    const login = async (usuario: string, password: string) => {
        try {
            setIsLoading(true);
            const result = await simpleAuthService.login(usuario, password);
            
            if (result.success && result.user) {
                setUser(result.user);
                // Almacenar credenciales para las peticiones API
                simpleAuthService.storeCredentials(usuario, password);
                return { success: true };
            } else {
                return { success: false, message: result.message || 'Error de autenticación' };
            }
        } catch (error) {
            console.error('Error en login:', error);
            return { success: false, message: 'Error de conexión' };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        simpleAuthService.logout();
        setUser(null);
    };

    const hasRole = (role: string) => {
        return user?.rol === role;
    };

    const hasAnyRole = (roles: string[]) => {
        return user ? roles.includes(user.rol) : false;
    };

    const value: SimpleAuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        hasRole,
        hasAnyRole
    };

    return (
        <SimpleAuthContext.Provider value={value}>
            {children}
        </SimpleAuthContext.Provider>
    );
};

export const useSimpleAuth = () => {
    const context = useContext(SimpleAuthContext);
    if (!context) {
        throw new Error('useSimpleAuth debe usarse dentro de SimpleAuthProvider');
    }
    return context;
};


















