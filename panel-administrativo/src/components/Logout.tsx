import React from 'react';
import { LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { obtenerPermisosRol } from '../types/auth.types';

const Logout: React.FC = () => {
    const { usuario, logout } = useAuth();

    const handleLogout = async () => {
        if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            await logout();
        }
    };

    if (!usuario) return null;

    const permisos = obtenerPermisosRol(usuario.rol);

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
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {/* Header del dropdown */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">{usuario.nombre}</p>
                            <p className="text-sm text-gray-500">Usuario: {usuario.usuario}</p>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {usuario.rol}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Información del rol */}
                <div className="p-4 border-b border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Accesos disponibles:</h4>
                    <div className="space-y-1">
                        {permisos.slice(0, 3).map((permiso, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-600">
                                <span className="mr-2">{permiso.icono}</span>
                                <span>{permiso.nombre}</span>
                            </div>
                        ))}
                        {permisos.length > 3 && (
                            <p className="text-xs text-gray-500">
                                +{permisos.length - 3} módulos más
                            </p>
                        )}
                    </div>
                </div>

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

                {/* Footer */}
                <div className="px-4 py-3 bg-gray-50 rounded-b-lg">
                    <p className="text-xs text-gray-500 text-center">
                        Sesión iniciada como {usuario.rol}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Logout;
