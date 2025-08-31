import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    AuthContextType, 
    AuthState, 
    LoginRequest, 
    Usuario, 
    Rol,
    obtenerPermisosRol,
    tieneAccesoModulo
} from '../types/auth.types';
import { login as loginService, logout as logoutService, verificarToken } from '../services/auth';

// Estado inicial
const initialState: AuthState = {
    usuario: null,
    token: localStorage.getItem('authToken'),
    isAuthenticated: false,
    isLoading: true,
    error: null,
};

// Tipos de acciones
type AuthAction =
    | { type: 'LOGIN_START' }
    | { type: 'LOGIN_SUCCESS'; payload: { usuario: Usuario; token: string } }
    | { type: 'LOGIN_FAILURE'; payload: string }
    | { type: 'LOGOUT' }
    | { type: 'CLEAR_ERROR' }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_USER'; payload: Usuario };

// Reducer para manejar el estado
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'LOGIN_START':
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                usuario: action.payload.usuario,
                token: action.payload.token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };
        case 'LOGIN_FAILURE':
            return {
                ...state,
                isLoading: false,
                error: action.payload,
                isAuthenticated: false,
            };
        case 'LOGOUT':
            return {
                ...state,
                usuario: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null,
            };
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            };
        case 'SET_USER':
            return {
                ...state,
                usuario: action.payload,
                isAuthenticated: true,
                isLoading: false,
            };
        default:
            return state;
    }
};

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

// Props del provider
interface AuthProviderProps {
    children: ReactNode;
}

// Provider del contexto
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const navigate = useNavigate();

    // Verificar token al cargar la aplicación
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const { valid, usuario } = await verificarToken();
                    if (valid && usuario) {
                        dispatch({ type: 'SET_USER', payload: usuario });
                        // NO redirigir automáticamente aquí para evitar bucles
                    } else {
                        // Token inválido, limpiar estado
                        dispatch({ type: 'LOGOUT' });
                        // NO navegar aquí, dejar que el ProtectedRoute maneje la redirección
                    }
                } catch (error) {
                    console.error('Error verificando token:', error);
                    dispatch({ type: 'LOGOUT' });
                    // NO navegar aquí, dejar que el ProtectedRoute maneje la redirección
                }
            } else {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };

        checkAuth();
    }, []); // Removido navigate de las dependencias

    // Función para redirigir según el rol (solo después del login exitoso)
    const redirigirSegunRol = (rol: Rol) => {
        console.log('🎯 Función redirigirSegunRol llamada con rol:', rol);
        const permisos = obtenerPermisosRol(rol);
        console.log('📋 Permisos obtenidos para el rol:', permisos);
        
        if (permisos.length > 0) {
            const rutaDestino = permisos[0].ruta;
            console.log('🚀 Redirigiendo a:', rutaDestino);
            // Redirigir a la primera ruta disponible para el rol
            navigate(rutaDestino);
        } else {
            console.log('❌ No se encontraron permisos para el rol, redirigiendo a unauthorized');
            navigate('/unauthorized');
        }
    };

    // Función para verificar acceso a módulos
    const canAccessModule = (moduleName: string): boolean => {
        if (!state.usuario) return false;
        return tieneAccesoModulo(state.usuario.rol, moduleName);
    };

    // Función de login
    const login = async (credentials: LoginRequest): Promise<void> => {
        try {
            console.log('🚀 Iniciando proceso de login...');
            dispatch({ type: 'LOGIN_START' });
            
            console.log('📞 Llamando al servicio de login...');
            const response = await loginService(credentials);
            console.log('📥 Respuesta del servicio:', response);
            
            if (response.success) {
                console.log('✅ Login exitoso, guardando datos...');
                // Guardar en localStorage
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('authUser', JSON.stringify(response.usuario));
                
                dispatch({ 
                    type: 'LOGIN_SUCCESS', 
                    payload: { 
                        usuario: response.usuario, 
                        token: response.token 
                    } 
                });

                console.log('🔄 Redirigiendo según rol:', response.usuario.rol);
                // Normalizar el rol para que coincida con los tipos del frontend
                const normalizarRol = (rol: string): Rol => {
                    const rolUpper = rol.toUpperCase();
                    switch (rolUpper) {
                        case 'ADMIN':
                            return 'Admin';
                        case 'VENDEDOR':
                            return 'Vendedor';
                        case 'INVENTARIO':
                            return 'Inventario';
                        case 'MARKETING':
                            return 'Marketing';
                        default:
                            return 'Admin'; // Por defecto
                    }
                };
                
                const rolNormalizado = normalizarRol(response.usuario.rol);
                console.log('🔄 Rol normalizado:', rolNormalizado);
                // Redirigir según el rol
                redirigirSegunRol(rolNormalizado);
            } else {
                console.log('❌ Login falló:', response.message);
                dispatch({ 
                    type: 'LOGIN_FAILURE', 
                    payload: response.message || 'Error en el login' 
                });
            }
        } catch (error: any) {
            console.error('💥 Error en el contexto de login:', error);
            dispatch({ 
                type: 'LOGIN_FAILURE', 
                payload: error.message || 'Error al conectar con el servidor' 
            });
        }
    };

    // Función de logout
    const logout = async (): Promise<void> => {
        try {
            await logoutService();
        } catch (error) {
            console.error('Error en logout:', error);
        } finally {
            dispatch({ type: 'LOGOUT' });
            navigate('/login');
        }
    };

    // Función para limpiar errores
    const clearError = (): void => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    // Función para verificar autenticación
    const checkAuth = async (): Promise<void> => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const { valid, usuario } = await verificarToken();
            
            if (valid && usuario) {
                dispatch({ type: 'SET_USER', payload: usuario });
            } else {
                dispatch({ type: 'LOGOUT' });
                navigate('/login');
            }
        } catch (error) {
            dispatch({ type: 'LOGOUT' });
            navigate('/login');
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    // Valor del contexto
    const contextValue: AuthContextType = {
        ...state,
        login,
        logout,
        clearError,
        checkAuth,
        canAccessModule,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
