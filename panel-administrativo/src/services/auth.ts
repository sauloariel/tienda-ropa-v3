import axios from 'axios';
import { LoginRequest, LoginResponse } from '../types/auth.types';
import { config } from '../config/config';

const API_BASE_URL = config.api.baseURL;

// Configurar axios para autenticación usando el LoguinController
const authAPI = axios.create({
    baseURL: `${API_BASE_URL}/login`, // Usar la ruta del LoguinController
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para incluir token en todas las peticiones
authAPI.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de autenticación
authAPI.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expirado o inválido
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Login de usuario usando LoguinController
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
        console.log('🔐 Intentando login con:', credentials);
        console.log('🌐 URL de la API:', `${API_BASE_URL}/login/auth/login`);

        const response = await authAPI.post('/auth/login', credentials);
        console.log('✅ Login exitoso:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('❌ Error en login:', error);
        console.error('📡 Response del servidor:', error.response?.data);
        console.error('🔢 Status code:', error.response?.status);
        throw new Error(
            error.response?.data?.message ||
            'Error al iniciar sesión. Verifica tus credenciales.'
        );
    }
};

// Verificar token usando LoguinController
export const verificarToken = async (): Promise<{ valid: boolean; usuario?: any }> => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            return { valid: false };
        }

        const response = await authAPI.get('/auth/verify');

        // Normalizar el rol del usuario
        if (response.data.usuario) {
            const normalizarRol = (rol: string) => {
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
                        return 'Admin';
                }
            };

            response.data.usuario.rol = normalizarRol(response.data.usuario.rol);
        }

        return { valid: true, usuario: response.data.usuario };
    } catch (error) {
        return { valid: false };
    }
};

// Logout del usuario usando LoguinController
export const logout = async (): Promise<void> => {
    try {
        await authAPI.post('/auth/logout');
    } catch (error) {
        console.error('Error en logout:', error);
    } finally {
        // Limpiar datos locales independientemente del resultado del backend
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
    }
};

// Obtener información del usuario actual usando LoguinController
export const obtenerUsuarioActual = async (): Promise<any> => {
    try {
        const response = await authAPI.get('/auth/me');

        // Normalizar el rol del usuario
        if (response.data.usuario) {
            const normalizarRol = (rol: string) => {
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
                        return 'Admin';
                }
            };

            response.data.usuario.rol = normalizarRol(response.data.usuario.rol);
        }

        return response.data.usuario;
    } catch (error: any) {
        console.error('Error al obtener usuario:', error);
        throw new Error('Error al obtener información del usuario');
    }
};

// Cambiar contraseña usando LoguinController
export const cambiarPassword = async (data: {
    password_actual: string;
    password_nuevo: string;
}): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await authAPI.put('/auth/change-password', data);
        return response.data;
    } catch (error: any) {
        console.error('Error al cambiar contraseña:', error);
        throw new Error(
            error.response?.data?.message ||
            'Error al cambiar la contraseña'
        );
    }
};

// Configurar axios global para incluir token en todas las peticiones
export const configurarAxiosGlobal = () => {
    axios.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('authUser');
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );
};
