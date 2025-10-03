import axios from 'axios';
import { simpleAuthService } from './simpleAuth';

// Configuración de la API
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar autenticación Basic Auth
api.interceptors.request.use(
    (config) => {
        const basicAuth = simpleAuthService.getBasicAuth();

        if (basicAuth) {
            config.headers.Authorization = `Basic ${basicAuth}`;
            console.log('🔑 Basic Auth agregado a la petición');
        } else {
            console.log('❌ No hay credenciales Basic Auth disponibles');
        }

        console.log('📤 API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            baseURL: config.baseURL,
            hasAuth: !!basicAuth
        });

        return config;
    },
    (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
    (response) => {
        console.log('📥 API Response:', {
            status: response.status,
            statusText: response.statusText,
            url: response.config.url
        });
        return response;
    },
    (error) => {
        console.error('❌ API Response Error:', {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            url: error.config?.url,
            data: error.response?.data,
        });

        // Si es 401, limpiar la sesión
        if (error.response?.status === 401) {
            console.log('🔐 Error 401 - Limpiando sesión');
            simpleAuthService.logout();

            // Redirigir al login si no estamos ya ahí
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;


















