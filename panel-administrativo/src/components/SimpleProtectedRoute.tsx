import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSimpleAuth } from '../contexts/SimpleAuthContext';
import { RefreshCw } from 'lucide-react';

interface SimpleProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

export const SimpleProtectedRoute: React.FC<SimpleProtectedRouteProps> = ({ 
    children, 
    allowedRoles = ['Admin', 'Vendedor', 'Inventario', 'Marketing'] 
}) => {
    const { user, isLoading, isAuthenticated, hasAnyRole } = useSimpleAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
                <p className="ml-2 text-gray-700">Cargando...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h2>
                    <p className="text-gray-700 mb-4">
                        No tienes permisos para acceder a esta sección.
                    </p>
                    <p className="text-sm text-gray-500">
                        Tu rol actual: <span className="font-semibold">{user?.rol}</span>
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default SimpleProtectedRoute;









