import React from 'react';
import { LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Logout: React.FC = () => {
    const { usuario, logout } = useAuth();

    const handleLogout = async () => {
        if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            await logout();
        }
    };

    if (!usuario) return null;

    return (
        <div className="relative group">
            {/* Botón del usuario */}
            <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                </div>
                <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{usuario.nombre}</p>
                    <p className="text-xs text-gray-500">{usuario.rol}</p>
                </div>
            </button>

            {/* Dropdown del usuario */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {/* Acciones del usuario */}
                <div className="p-2">
                    <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200">
                        <Settings className="h-4 w-4 mr-3 text-gray-400" />
                        Configuración
                    </button>
                    
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 transition-colors duration-200 mt-1"
                    >
                        <LogOut className="h-4 w-4 mr-3" />
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Logout;
