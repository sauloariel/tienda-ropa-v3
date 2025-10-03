import axios from 'axios';
import type { Cliente, LoginRequest, LoginResponse, RegisterRequest } from '../types/cliente.types';

const API_BASE_URL = 'http://localhost:4000';

// Configurar axios para autenticación de clientes
const clientAuthAPI = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para manejar errores
clientAuthAPI.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Client Auth API Error:', error);
        return Promise.reject(error);
    }
);

// Servicios de autenticación para clientes (simplificado)
export const clientAuthService = {
    // Login del cliente
    login: async (mail: string, password: string): Promise<LoginResponse> => {
        try {
            const response = await clientAuthAPI.post('/api/clientes/auth/login', {
                mail,
                password
            });
            return response.data;
        } catch (error: any) {
            console.error('Error en login de cliente:', error);
            throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
        }
    },

    // Registro de nuevo cliente
    register: async (clienteData: RegisterRequest): Promise<LoginResponse> => {
        try {
            const response = await clientAuthAPI.post('/api/clientes/auth/register', clienteData);
            return response.data;
        } catch (error: any) {
            console.error('Error en registro de cliente:', error);
            throw new Error(error.response?.data?.message || 'Error al registrarse');
        }
    },

    // Verificar cliente por email (simplificado)
    verifyClient: async (mail: string): Promise<{ success: boolean; cliente?: Cliente }> => {
        try {
            const response = await clientAuthAPI.post('/api/clientes/auth/verify', { mail });
            return response.data;
        } catch (error: any) {
            console.error('Error al verificar cliente:', error);
            return { success: false };
        }
    },

    // Logout del cliente
    logout: async (): Promise<void> => {
        try {
            await clientAuthAPI.post('/api/clientes/auth/logout');
        } catch (error: any) {
            console.error('Error en logout:', error);
        }
    },

    // Reenviar email de verificación
    resendVerificationEmail: async (email: string): Promise<{ success: boolean; message?: string }> => {
        try {
            const response = await clientAuthAPI.post('/api/clientes/auth/resend-verification', {
                email
            });
            return response.data;
        } catch (error: any) {
            console.error('Error reenviando email de verificación:', error);
            throw new Error(error.response?.data?.message || 'Error reenviando email de verificación');
        }
    },

    // Solicitar recuperación de contraseña
    forgotPassword: async (mail: string): Promise<{ success: boolean; message?: string; resetToken?: string; cliente?: any }> => {
        try {
            const response = await clientAuthAPI.post('/api/clientes/auth/forgot-password', {
                mail
            });
            return response.data;
        } catch (error: any) {
            console.error('Error solicitando recuperación de contraseña:', error);
            throw new Error(error.response?.data?.message || 'Error solicitando recuperación de contraseña');
        }
    },

    // Verificar token de recuperación
    verifyResetToken: async (resetToken: string): Promise<{ success: boolean; message?: string; cliente?: any }> => {
        try {
            const response = await clientAuthAPI.get(`/api/clientes/auth/reset-password/${resetToken}`);
            return response.data;
        } catch (error: any) {
            console.error('Error verificando token de recuperación:', error);
            throw new Error(error.response?.data?.message || 'Error verificando token de recuperación');
        }
    },

    // Cambiar contraseña con token
    resetPassword: async (resetToken: string, nuevaPassword: string): Promise<{ success: boolean; message?: string }> => {
        try {
            const response = await clientAuthAPI.post('/api/clientes/auth/reset-password', {
                resetToken,
                nuevaPassword
            });
            return response.data;
        } catch (error: any) {
            console.error('Error cambiando contraseña:', error);
            throw new Error(error.response?.data?.message || 'Error cambiando contraseña');
        }
    }
};

export default clientAuthService;