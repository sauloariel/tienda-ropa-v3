import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Rol, tieneAccesoRuta } from '../types/auth.types';

interface RoleGuardProps {
    children: ReactNode;
    roles: Rol[];
    ruta?: string;
    fallback?: ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ 
    children, 
    roles, 
    ruta,
    fallback 
}) => {
    const { usuario, isAuthenticated, isLoading } = useAuth();

    // Mostrar loading mientras se verifica la autenticación
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Verificando permisos...</p>
                </div>
            </div>
        );
    }

    // Si no está autenticado, redirigir al login
    if (!isAuthenticated || !usuario) {
        return <Navigate to="/login" replace />;
    }

    // Verificar si el usuario tiene uno de los roles requeridos
    const tieneRolRequerido = roles.includes(usuario.rol);

    // Si se especifica una ruta, verificar acceso específico
    if (ruta && !tieneAccesoRuta(usuario.rol, ruta)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Si no tiene el rol requerido, mostrar fallback o redirigir
    if (!tieneRolRequerido) {
        if (fallback) {
            return <>{fallback}</>;
        }
        return <Navigate to="/unauthorized" replace />;
    }

    // Usuario autenticado y con permisos, mostrar contenido
    return <>{children}</>;
};

export default RoleGuard;







