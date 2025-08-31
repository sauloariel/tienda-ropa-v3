import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Home, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Unauthorized: React.FC = () => {
    const navigate = useNavigate();
    const { usuario } = useAuth();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        if (usuario) {
            // Redirigir a la primera ruta disponible para el rol del usuario
            const permisos = ['/dashboard', '/pos', '/productos', '/marketing'];
            const rutaDisponible = permisos.find(ruta => 
                window.location.pathname !== ruta
            ) || '/dashboard';
            navigate(rutaDisponible);
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center">
                {/* Icono de Acceso Denegado */}
                <div className="mx-auto h-32 w-32 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-8 shadow-2xl">
                    <Shield className="h-16 w-16 text-white" />
                </div>

                {/* Título Principal */}
                <h1 className="text-5xl font-bold text-gray-900 mb-4">
                    Acceso Denegado
                </h1>

                {/* Mensaje de Error */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
                        <h2 className="text-2xl font-semibold text-gray-800">
                            No tienes permisos para acceder a esta página
                        </h2>
                    </div>
                    
                    <p className="text-lg text-gray-600 mb-6">
                        Tu rol actual ({usuario?.rol || 'No definido'}) no tiene los permisos necesarios 
                        para acceder a esta funcionalidad del sistema.
                    </p>

                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h3 className="font-medium text-gray-800 mb-2">¿Qué puedes hacer?</h3>
                        <ul className="text-sm text-gray-600 space-y-1 text-left max-w-md mx-auto">
                            <li>• Contacta al administrador del sistema</li>
                            <li>• Solicita acceso a esta funcionalidad</li>
                            <li>• Navega a las secciones disponibles para tu rol</li>
                        </ul>
                    </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={handleGoBack}
                        className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Volver Atrás
                    </button>
                    
                    <button
                        onClick={handleGoHome}
                        className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        <Home className="h-5 w-5 mr-2" />
                        Ir al Inicio
                    </button>
                </div>

                {/* Información Adicional */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500 mb-2">
                        Si crees que esto es un error, contacta al soporte técnico.
                    </p>
                    <p className="text-xs text-gray-400">
                        Código de error: 403 - Forbidden
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;





